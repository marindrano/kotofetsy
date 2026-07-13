package main

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/charmbracelet/bubbles/spinner"
	"github.com/charmbracelet/bubbles/textinput"
	"github.com/charmbracelet/bubbles/viewport"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

const sidenavWidth = 28

type screen int

const (
	screenPicking screen = iota
	screenLimit
	screenRunning
)

type providerState int

const (
	stateIdle providerState = iota
	stateRunning
	stateDone
	stateError
)

type providerStatus struct {
	state providerState
	lines []string // full accumulated log history for this provider, shown in the viewport when highlighted
}

// statusMsg/doneMsg are sent from the per-provider goroutines via
// model.program.Send(), which is how Bubble Tea receives updates from
// long-running background work outside its own Update loop.
type statusMsg struct {
	provider string
	line     string
}

type doneMsg struct {
	provider string
	err      error
}

type model struct {
	program *tea.Program

	screen     screen
	cursor     int
	selected   map[int]bool
	limitInput textinput.Model
	spin       spinner.Model

	limit      int
	crawlerDir string
	statuses   map[string]*providerStatus
	pending    int // providers still running

	runOrder  []string // selected provider names, in list order — sidenav during the running screen
	runCursor int
	vp        viewport.Model
	width     int
	height    int

	cancel context.CancelFunc // cancels all running crawler subprocesses on quit
}

func newModel(defaultLimit int, crawlerDir string) *model {
	ti := textinput.New()
	ti.SetValue(fmt.Sprint(defaultLimit))
	ti.Focus()
	ti.CharLimit = 6

	sp := spinner.New()
	sp.Spinner = spinner.Dot

	return &model{
		screen:     screenPicking,
		selected:   map[int]bool{},
		limitInput: ti,
		spin:       sp,
		crawlerDir: crawlerDir,
		statuses:   map[string]*providerStatus{},
	}
}

func (m *model) Init() tea.Cmd {
	return m.spin.Tick
}

func (m *model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		return m.handleKey(msg)

	case tea.WindowSizeMsg:
		m.width, m.height = msg.Width, msg.Height
		m.vp.Width, m.vp.Height = m.layout()
		m.refreshViewport()
		return m, nil

	case statusMsg:
		st := m.statuses[msg.provider]
		st.state = stateRunning
		st.lines = append(st.lines, msg.line)
		if m.highlighted() == msg.provider {
			m.refreshViewport()
		}
		return m, nil

	case doneMsg:
		st := m.statuses[msg.provider]
		if msg.err != nil {
			st.state = stateError
			st.lines = append(st.lines, "error: "+msg.err.Error())
		} else {
			st.state = stateDone
		}
		m.pending--
		if m.highlighted() == msg.provider {
			m.refreshViewport()
		}
		return m, nil

	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spin, cmd = m.spin.Update(msg)
		return m, cmd
	}

	if m.screen == screenLimit {
		var cmd tea.Cmd
		m.limitInput, cmd = m.limitInput.Update(msg)
		return m, cmd
	}
	return m, nil
}

func (m *model) handleKey(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	switch msg.String() {
	case "ctrl+c", "q":
		if m.cancel != nil {
			m.cancel() // kill any running crawler subprocesses (uv + python) before exiting
		}
		return m, tea.Quit
	}

	switch m.screen {
	case screenPicking:
		switch msg.String() {
		case "up", "k":
			if m.cursor > 0 {
				m.cursor--
			}
		case "down", "j":
			if m.cursor < len(providers)-1 {
				m.cursor++
			}
		case " ":
			m.selected[m.cursor] = !m.selected[m.cursor]
		case "a":
			for i := range providers {
				m.selected[i] = true
			}
		case "enter":
			if len(m.selected) == 0 {
				for i := range providers {
					m.selected[i] = true
				}
			}
			m.screen = screenLimit
		}
		return m, nil

	case screenLimit:
		switch msg.String() {
		case "esc":
			m.screen = screenPicking
			return m, nil
		case "enter":
			limit, err := strconv.Atoi(strings.TrimSpace(m.limitInput.Value()))
			if err != nil || limit < 0 { // 0 is valid: unlimited
				return m, nil
			}
			m.limit = limit
			m.startRun()
			return m, nil
		}
		var cmd tea.Cmd
		m.limitInput, cmd = m.limitInput.Update(msg)
		return m, cmd

	case screenRunning:
		switch msg.String() {
		case "up", "k":
			if m.runCursor > 0 {
				m.runCursor--
				m.refreshViewport()
			}
		case "down", "j":
			if m.runCursor < len(m.runOrder)-1 {
				m.runCursor++
				m.refreshViewport()
			}
		}
		var cmd tea.Cmd
		m.vp, cmd = m.vp.Update(msg)
		return m, cmd
	}

	return m, nil
}

// layout computes the inner width/height of the viewport, accounting for the two
// rounded-border boxes (sidenav + viewport) horizontally and the header/footer
// lines vertically. Guards against tiny/zero sizes before the first WindowSizeMsg.
func (m *model) layout() (vpW, vpH int) {
	vpW = m.width - sidenavWidth - 4 // sidenav border (2) + viewport border (2)
	if vpW < 10 {
		vpW = 10
	}
	vpH = m.height - 6 // header (1) + footer (1) + viewport border (2) + 2 spare
	if vpH < 3 {
		vpH = 3
	}
	return
}

// highlighted returns the provider currently selected in the sidenav, or ""
// before a run has started.
func (m *model) highlighted() string {
	if m.runCursor < 0 || m.runCursor >= len(m.runOrder) {
		return ""
	}
	return m.runOrder[m.runCursor]
}

// refreshViewport pushes the highlighted provider's accumulated log lines
// into the viewport and scrolls to the bottom, so it always shows the latest.
func (m *model) refreshViewport() {
	name := m.highlighted()
	if name == "" {
		return
	}
	m.vp.SetContent(strings.Join(m.statuses[name].lines, "\n"))
	m.vp.GotoBottom()
}

func (m *model) startRun() {
	m.screen = screenRunning
	w, h := m.layout()
	m.vp = viewport.New(w, h)
	ctx, cancel := context.WithCancel(context.Background())
	m.cancel = cancel
	for i, name := range providers {
		if !m.selected[i] {
			continue
		}
		m.runOrder = append(m.runOrder, name)
		m.statuses[name] = &providerStatus{state: stateIdle}
		m.pending++

		name := name
		go func() {
			err := runCrawler(ctx, name, m.limit, m.crawlerDir, func(line string) {
				m.program.Send(statusMsg{provider: name, line: line})
			})
			m.program.Send(doneMsg{provider: name, err: err})
		}()
	}
}

// Palette — cohesive set tuned for dark terminals (the common case for a dev CLI).
// ponytail: fixed 256-colors, not AdaptiveColor — swap if light-terminal support ever matters.
var (
	cBrand  = lipgloss.Color("205")
	cGreen  = lipgloss.Color("42")
	cRed    = lipgloss.Color("203")
	cAmber  = lipgloss.Color("214")
	cSubtle = lipgloss.Color("244")
	cBorder = lipgloss.Color("238")

	appBadge      = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("231")).Background(cBrand).Padding(0, 1)
	titleStyle    = lipgloss.NewStyle().Bold(true).Foreground(cBrand)
	hintStyle     = lipgloss.NewStyle().Foreground(cSubtle)
	selectedStyle = lipgloss.NewStyle().Bold(true).Foreground(cBrand)
	doneStyle     = lipgloss.NewStyle().Foreground(cGreen)
	errorStyle    = lipgloss.NewStyle().Foreground(cRed)
	runningStyle  = lipgloss.NewStyle().Foreground(cAmber)
	boxStyle      = lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(cBorder)
)

func (m *model) countSelected() int {
	n := 0
	for _, v := range m.selected {
		if v {
			n++
		}
	}
	return n
}

func (m *model) View() string {
	switch m.screen {
	case screenPicking:
		return m.viewPicking()
	case screenLimit:
		return m.viewLimit()
	default:
		return m.viewRunning()
	}
}

func (m *model) viewPicking() string {
	var b strings.Builder
	b.WriteString(appBadge.Render(" IKOTOFETSY ") + "  " + titleStyle.Render("pick providers to crawl") + "\n\n")
	for i, name := range providers {
		box := hintStyle.Render("○")
		if m.selected[i] {
			box = doneStyle.Render("●")
		}
		marker := "   "
		nameText := name
		if i == m.cursor {
			marker = selectedStyle.Render("▶  ") // brand arrow, the whole highlighted row in brand
			nameText = selectedStyle.Render(name)
		}
		b.WriteString(marker + box + "  " + nameText + "\n")
	}
	n := m.countSelected()
	status := fmt.Sprintf("%d of %d selected", n, len(providers))
	if n == 0 {
		status += hintStyle.Render("  (enter with none = all)")
	}
	b.WriteString("\n" + status + "\n")
	b.WriteString(hintStyle.Render("↑/↓ move · space toggle · a all · enter start · q quit"))
	return b.String()
}

func (m *model) viewLimit() string {
	var b strings.Builder
	n := m.countSelected()
	if n == 0 {
		n = len(providers)
	}
	b.WriteString(appBadge.Render(" IKOTOFETSY ") + "  " +
		titleStyle.Render(fmt.Sprintf("how many new articles each? (%d providers)", n)) + "\n\n")
	b.WriteString(boxStyle.Padding(0, 1).Render(m.limitInput.View()) + "\n\n")
	b.WriteString(hintStyle.Render("0 = run until exhausted (grab everything)") + "\n")
	b.WriteString(hintStyle.Render("enter start · esc back · q quit"))
	return b.String()
}

// articlesSaved counts the "  - 'title' (date)" bullet lines main.py prints per
// new article, so the sidenav can show a live per-provider count without the
// Python side needing a separate structured-progress channel.
func articlesSaved(lines []string) int {
	n := 0
	for _, l := range lines {
		if strings.HasPrefix(l, "  - ") {
			n++
		}
	}
	return n
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	if n <= 1 {
		return s[:n]
	}
	return s[:n-1] + "…"
}

func (m *model) viewRunning() string {
	var done, running, errored, total int
	var nav strings.Builder
	nav.WriteString(hintStyle.Render("PROVIDERS") + "\n")
	for i, name := range m.runOrder {
		st := m.statuses[name]
		var glyph string
		switch st.state {
		case stateIdle, stateRunning:
			glyph = runningStyle.Render(m.spin.View())
			running++
		case stateDone:
			glyph = doneStyle.Render("✓")
			done++
		case stateError:
			glyph = errorStyle.Render("✗")
			errored++
		}
		count := articlesSaved(st.lines)
		total += count
		marker := "  "
		nameText := fmt.Sprintf("%-18s", truncate(name, 18)) // pad before styling; ANSI breaks %-Ns width
		if i == m.runCursor {
			marker = selectedStyle.Render("▶ ")
			nameText = selectedStyle.Render(nameText)
		}
		row := fmt.Sprintf("%s%s %s %s", marker, glyph, nameText, strconv.Itoa(count))
		nav.WriteString(row + "\n")
	}

	sidenav := boxStyle.Width(sidenavWidth).Height(m.vp.Height).Render(nav.String())
	vpBox := boxStyle.Width(m.vp.Width).Height(m.vp.Height).Render(m.vp.View())
	body := lipgloss.JoinHorizontal(lipgloss.Top, sidenav, vpBox)

	summary := fmt.Sprintf("%s  %s  %s  %s",
		hintStyle.Render(fmt.Sprintf("%d providers", len(m.runOrder))),
		runningStyle.Render(fmt.Sprintf("%d running", running)),
		doneStyle.Render(fmt.Sprintf("%d done", done)),
		errorStyle.Render(fmt.Sprintf("%d err", errored)),
	)
	header := appBadge.Render(" IKOTOFETSY ") + "  " + summary + "  " +
		titleStyle.Render(fmt.Sprintf("%d articles", total))

	keys := "↑/↓ switch provider · q quit"
	if m.pending == 0 {
		keys = doneStyle.Render("all done") + hintStyle.Render(" · q quit")
	}

	return header + "\n" + body + "\n" + hintStyle.Render(keys)
}
