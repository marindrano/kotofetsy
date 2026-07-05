# News providers — dead / unusable / unverified

Sources that were researched as candidates but are **not** wired into the crawler, because they're actually down, gone, or have nothing scrapeable — not because of a crawler bug. See [`NEWS_PROVIDERS_ALIVE.md`](./NEWS_PROVIDERS_ALIVE.md) for the working ones.

| Name | URL | Language(s) | Note | Status |
|---|---|---|---|---|
| Orange actu Madagascar | https://actu.orange.mg/ | French, Malagasy | Continuous news portal run by telecom operator Orange Madagascar | **Unreachable** — connection timeout, network-level issue, not an anti-bot block |
| Madagate | https://www.madagate.org/ | French, Malagasy | Early Malagasy internet news media; diaspora- and politics-oriented | **Dead** — homepage 302s to a 404 page; site appears parked/abandoned |
| Lakroan'i Madagasikara (Lakroa) | https://www.lakroa.mg/ | Malagasy, French | Catholic Episcopal Conference of Madagascar's newspaper, est. 1927 | **Dead** — DNS resolution fails (SERVFAIL), domain not currently live |
| Sobika | https://www.sobikamada.com/ | French | Diaspora-oriented news/info portal (formerly `sobika.com`) | **Dead** — domain is parked (abovedomains.com placeholder), no real content |
| Ny Valosoa Vaovao | http://www.gvalosoa.net/ | Malagasy | Newspaper linked to opposition politician Marc Ravalomanana | **Unreachable** — DNS resolves but both HTTP/HTTPS connections time out |
| Madagascar News Observer | https://www.madagascarnewsobserver.com/ | English | English-language outlet focused on Madagascar business & economy | **Not usable** — pure aggregator, links out to third-party sources, no original articles to scrape |
| La Vérité | https://laverite.mg/ | French | National daily focused on information and analysis | **Down** — server returns HTTP 500 on every request, site-side outage |
| La Nation | https://www.lanation.mg/ | French | Online daily newspaper | **Dead** — DNS resolution fails (ENOTFOUND) |
| Madagascar Matin | https://www.matin.mg/ | French, Malagasy | One of the oldest daily newspapers, print + online | **Not usable** — site shows a "Coming Soon" placeholder, no real content live |
| Soa i Madagasikara Radio | https://radio.soaimadagasikara.org/actualites/ | French | Radio station's news section, aggregates coverage from major outlets | **Not usable** — webradio/podcast platform; the "actualités" page just re-embeds other outlets' RSS client-side, no original articles on this domain |
| MadOnline | unverified — no confirmed live URL found | French | Site run by an association of independent Malagasy journalists | **Not started** — no URL to even test |
| InfoKmada | unverified — no confirmed live URL found | Malagasy (video-focused) | Video-news outlet in Malagasy | **Not started** — no URL to even test |
| Agence Malagasy de Presse | unverified — no confirmed live URL found | French | National news agency (Antananarivo) — politics, economy, society, culture | **Not started** — no URL to even test |

## Notes

- 10 of these were actually checked and found dead/unreachable/unusable; 3 (MadOnline, InfoKmada, Agence Malagasy de Presse) were never confirmed to have a live URL at all.
- Domain status can change — re-verify periodically rather than treating "Dead" as permanent.
