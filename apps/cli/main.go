package main

import (
	"bufio"
	"context"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"sync"
	"syscall"

	tea "github.com/charmbracelet/bubbletea"
)

// providers mirrors the PROVIDERS dict keys in apps/crawler/providers.py.
// Kept as a plain hardcoded list here rather than introspecting the Python
// file — 11 static strings don't need dynamic coupling across languages.
var providers = []string{
	"midi-madagasikara",
	"lexpress-mg",
	"madagascar-tribune",
	"newsmada",
	"2424-mg",
	"lgdi-madagascar",
	"freenews-mg",
	"moov-mg",
	"malagasynews-mbs",
	"kolo-tv",
	"journalmadagascar",
}

func main() {
	headless := flag.Bool("headless", false, "run without the TUI (for scheduled/cron use); default is the interactive picker")
	providersFlag := flag.String("providers", "all", "comma-separated provider names, or \"all\" (headless mode only)")
	limit := flag.Int("limit", 10, "max NEW articles to fetch per provider (0 = unlimited, run until exhausted)")
	crawlerDir := flag.String("crawler-dir", "../crawler", "path to apps/crawler")
	flag.Parse()

	if *headless {
		names := providers
		if *providersFlag != "all" {
			names = strings.Split(*providersFlag, ",")
		}
		runHeadless(names, *limit, *crawlerDir)
		return
	}

	m := newModel(*limit, *crawlerDir)
	p := tea.NewProgram(m)
	m.program = p // lets the per-provider goroutines call p.Send() from outside Update()
	if _, err := p.Run(); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}

// runCrawler shells out to the Python crawler for one provider, streaming
// each stdout line to onLine as it arrives. Cancelling ctx kills the subprocess
// tree (see below) so quitting the TUI doesn't leave crawlers running.
func runCrawler(ctx context.Context, name string, limit int, crawlerDir string, onLine func(string)) error {
	cmd := exec.CommandContext(ctx, "uv", "run", "main.py", name, "--limit", fmt.Sprint(limit))
	cmd.Dir = crawlerDir
	// Give the child its own process group, then kill the whole group on cancel.
	// `uv run` spawns python as a child; killing only uv (the default) would orphan
	// the python crawler, since it can't forward an un-catchable SIGKILL.
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	cmd.Cancel = func() error {
		return syscall.Kill(-cmd.Process.Pid, syscall.SIGKILL) // negative pid = the whole group
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	cmd.Stderr = cmd.Stdout // scrapling logs to stderr — fold it into the same stream

	if err := cmd.Start(); err != nil {
		return err
	}

	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		onLine(scanner.Text())
	}

	return cmd.Wait()
}

func runHeadless(names []string, limit int, crawlerDir string) {
	// Ctrl+C / SIGTERM cancels ctx, which kills each crawler's process group.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	var wg sync.WaitGroup
	for _, name := range names {
		wg.Add(1)
		go func(name string) {
			defer wg.Done()
			err := runCrawler(ctx, name, limit, crawlerDir, func(line string) {
				fmt.Printf("[%s] %s\n", name, line)
			})
			if err != nil {
				fmt.Printf("[%s] error: %v\n", name, err)
			}
		}(name)
	}
	wg.Wait()
}
