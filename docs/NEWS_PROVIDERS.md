# News providers

Candidate Malagasy/Madagascar news sources for the crawler (see [`architecture/crawler.md`](./architecture/crawler.md)), found via Malagasy, English, and French keyword searches. **Status** tracks whether crawler support for that source has been built yet — everything starts at "Not started" since the crawler doesn't ingest any source yet.

| Name | URL | Language(s) | Note | Status |
|---|---|---|---|---|
| Midi Madagasikara | https://midi-madagasikara.mg/ | French, Malagasy | Founded 1983, Madagascar's first national daily — web edition | Not started |
| L'Express de Madagascar | https://www.lexpress.mg/ | French, Malagasy | Privately owned daily print newspaper since 1995, broad national coverage | Not started |
| Madagascar-Tribune.com | https://www.madagascar-tribune.com/ | French | Long-running independent online newspaper — politics, economy, culture, sports | Not started |
| Newsmada (Les Nouvelles) | https://newsmada.com/ | French, Malagasy | Web edition of daily newspaper "Les Nouvelles," Antananarivo | Not started |
| La Gazette de la Grande Île | https://lgdi-madagascar.com/ | French, Malagasy | Investigative/opposition-leaning daily founded 2003; also seen at `lagazette-dgi.com` — verify which domain is live before crawling | Not started |
| Orange actu Madagascar | https://actu.orange.mg/ | French, Malagasy | Continuous news portal run by telecom operator Orange Madagascar | Not started |
| Madagate | https://www.madagate.org/ | French, Malagasy | Early Malagasy internet news media; diaspora- and politics-oriented | Not started |
| Lakroan'i Madagasikara (Lakroa) | https://www.lakroa.mg/ | Malagasy, French | Catholic Episcopal Conference of Madagascar's newspaper, est. 1927 | Not started |
| Sobika | https://www.sobikamada.com/ | French | Diaspora-oriented news/info portal (formerly `sobika.com`); alt domain `sobika.org` also seen — verify current one | Not started |
| Free News | https://www.freenews.mg/ | French | Digital-native daily news site | Not started |
| Ny Valosoa Vaovao | http://www.gvalosoa.net/ | Malagasy | Newspaper linked to opposition politician Marc Ravalomanana | Not started |
| Moov | https://new.moov.mg/ | Malagasy, French | News portal — politics, economy, culture, health, sports | Not started |
| Malagasy News (MBS) | https://www.malagasynews.com/ | French, Malagasy | Online newsroom of the Malagasy Broadcasting System (radio group) | Not started |
| Radio Nationale Malagasy (RNM) | https://www.radiomadagasikara.com/ | Malagasy, French | State/public radio station's news site, founded 1931 | Not started |
| Kolo TV | https://tv.kolo.mg/ | French, Malagasy | TV/radio broadcaster's news site, owned by SMPC media group | Not started |
| Madagascar News Observer | https://www.madagascarnewsobserver.com/ | English | English-language outlet focused on Madagascar business & economy | Not started |
| Journal Madagascar | https://www.journalmadagascar.com/ | Malagasy, French | Independent, generalist digital-native outlet | Not started |
| 2424.mg | https://2424.mg/ | French | Independent, digital-native daily news site | Not started |
| La Vérité | https://laverite.mg/ | French | National daily focused on information and analysis | Not started |
| La Nation | https://www.lanation.mg/ | French | Online daily newspaper | Not started |
| Madagascar Matin | https://www.matin.mg/ | French, Malagasy | One of the oldest daily newspapers, print + online | Not started |
| Soa i Madagasikara Radio | https://radio.soaimadagasikara.org/actualites/ | French | Radio station's news section, aggregates coverage from major outlets | Not started |
| MadOnline | unverified — no confirmed live URL found | French | Site run by an association of independent Malagasy journalists | Not started |
| InfoKmada | unverified — no confirmed live URL found | Malagasy (video-focused) | Video-news outlet in Malagasy | Not started |
| Agence Malagasy de Presse | unverified — no confirmed live URL found | French | National news agency (Antananarivo) — politics, economy, society, culture | Not started |

## Notes

- Rows marked "unverified" surfaced by name across searches but without a search result confirming a live root URL — check manually before wiring into the crawler.
- A couple of domains have two candidate URLs in circulation (La Gazette de la Grande Île, Sobika); confirm the current one before crawling.
- This list was compiled by parallel research across Malagasy, English, and French search queries — re-run periodically, since outlets change domains or shut down.
