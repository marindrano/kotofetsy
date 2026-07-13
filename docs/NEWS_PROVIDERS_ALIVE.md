# News providers — working

Sources wired into the crawler (`apps/crawler/providers.py`) and verified working. See [`NEWS_PROVIDERS_DEAD.md`](./NEWS_PROVIDERS_DEAD.md) for sources that were researched but turned out dead, unreachable, or unusable.

| Name | URL | Language(s) | Note |
|---|---|---|---|
| Midi Madagasikara | https://midi-madagasikara.mg/ | French, Malagasy | Founded 1983, Madagascar's first national daily — behind a Sucuri JS challenge, needs `StealthyFetcher` |
| L'Express de Madagascar | https://www.lexpress.mg/ | French, Malagasy | Privately owned daily since 1995 — sitemap only covers back to 2023-10, likely a rolling window not full history |
| Madagascar-Tribune.com | https://www.madagascar-tribune.com/ | French | Long-running independent online newspaper — no article sitemap, custom category-discovery + pagination crawl |
| Newsmada (Les Nouvelles) | https://newsmada.com/ | French, Malagasy | Web edition of daily newspaper "Les Nouvelles," Antananarivo |
| La Gazette de la Grande Île | https://lgdi-madagascar.com/ | French, Malagasy | Investigative/opposition-leaning daily founded 2003 — this domain confirmed live; `lagazette-dgi.com` not tested |
| Free News | https://www.freenews.mg/ | French | Digital-native daily news site — WordPress, no sitemap; discovered via the open WP REST API (`/wp-json/wp/v2/posts`, ~3200 posts paginated) |
| Moov | https://new.moov.mg/ | Malagasy, French | News portal — JS SPA with a locked Strapi CMS, no static pagination; article pages are server-rendered so we spider `/article/` related-links breadth-first from the homepage (coverage limited to the reachable link graph) |
| Malagasy News (MBS) | https://www.malagasynews.com/ | French, Malagasy | Online newsroom of the Malagasy Broadcasting System (radio group) — mostly video posts, expect thin/empty `body` |
| Kolo TV | https://tv.kolo.mg/ | French, Malagasy | TV/radio broadcaster's news site, owned by SMPC media group |
| Journal Madagascar | https://www.journalmadagascar.com/ | Malagasy, French | Independent, generalist digital-native outlet |
| 2424.mg | https://2424.mg/ | French | Independent, digital-native daily news site |

## Notes

- 11 of 25 researched sources are working as of this pass.
- Domain status can change — re-verify periodically rather than assuming these stay up forever.
