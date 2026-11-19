# Store endpoints

None of these are documented APIs except iTunes Search/Lookup. They can change without notice. `/aso-refresh` re-probes them; if a probe fails, fall back to asking the user to paste the listing.

## App Store

**Lookup** — the full listing minus subtitle, keywords and promotional text.
```
GET https://itunes.apple.com/lookup?id=<id>&country=<cc>
GET https://itunes.apple.com/lookup?bundleId=<bundle>&country=<cc>
```
- Works; JSON `{resultCount, results[]}` with `trackName, description, releaseNotes, sellerName, primaryGenreName, averageUserRating, userRatingCount, screenshotUrls, version`. **No `subtitle`** — scrape apps.apple.com or ask. [probe](https://itunes.apple.com/lookup?id=284882215&country=us) · 2026-11-19
- Rate limit "approximately 20 calls per minute". [official](https://performance-partners.apple.com/search-api) · 2026-11-19

**Search** — candidate competitors. The result order is **not** the App Store's ranking.
```
GET https://itunes.apple.com/search?term=<q>&entity=software&country=<cc>&limit=50
```
- Works; caps at ~200 results. [probe](https://itunes.apple.com/search?term=habit+tracker&entity=software&country=us&limit=3) · 2026-11-19

**Search hints (autocomplete)** — needs the storefront header, or it returns an empty list.
```
GET https://search.itunes.apple.com/WebObjects/MZSearchHints.woa/wa/hints?clientApplication=Software&term=<q>
X-Apple-Store-Front: <storefrontId>-<langId>,29
```
Storefronts: US `143441-1`, GB `143444-2`, DE `143443-4`, FR `143442-3`, JP `143462-9`, ES `143454-8`, IT `143450-7`, BR `143503-15`, MX `143468-28`, CA `143455-6`, AU `143460-27`, RU `143469-16`, KR `143466-13`, CN `143465-19`.
- Returns a plist `{hints:[{term,url}]}`, about 10 per query, with no volume field. A `storefront=` query parameter doesn't work. [probe](https://search.itunes.apple.com/WebObjects/MZSearchHints.woa/wa/hints?clientApplication=Software&term=habit) · 2026-11-19

**Top charts**
```
GET https://itunes.apple.com/<cc>/rss/topfreeapplications/limit=100/genre=<genreId>/json
```
- Legacy RSS works: free, paid, grossing and new feeds, genre filter; limit caps at 100. [probe](https://itunes.apple.com/us/rss/topfreeapplications/limit=5/json) · 2026-11-19
- New RSS `rss.marketingtools.apple.com/api/v2/<cc>/apps/top-free/<n>/apps.json` is flaky: top-grossing returns 404, genre is ignored, and it intermittently returns 504. Prefer the legacy feed. [probe](https://rss.marketingtools.apple.com/api/v2/us/apps/top-free/10/apps.json) · 2026-11-19

**Reviews**
```
GET https://itunes.apple.com/<cc>/rss/customerreviews/page=1/id=<id>/sortby=mostrecent/json
```
- Works. [probe](https://itunes.apple.com/us/rss/customerreviews/page=1/id=284882215/sortby=mostrecent/json) · 2026-11-19

## Google Play

**Details** — HTML page. The JSON-LD `SoftwareApplication` block holds the name, the short description (`description`), category and rating. The full description is in the page HTML.
```
GET https://play.google.com/store/apps/details?id=<pkg>&hl=<lang>&gl=<cc>
```
- Works; about 1.3 MB; returns 404 for unknown ids. [probe](https://play.google.com/store/apps/details?id=com.spotify.music&hl=en&gl=US) · 2026-11-19

**Search** — the order of `details?id=` links in the HTML is the result order.
```
GET https://play.google.com/store/search?q=<q>&c=apps&hl=<lang>&gl=<cc>
```
- Works. [probe](https://play.google.com/store/search?q=photo%20editor&c=apps&hl=en&gl=US) · 2026-11-19

**Autocomplete** — batchexecute RPC `IJ4APc`.
```
POST https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&hl=<lang>&gl=<cc>
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
f.req=[[["IJ4APc","[[null,[\"<q>\"],[10],[2],4]]",null,"generic"]]]
```
Strip the `)]}'` prefix, take `[0][2]` and JSON-parse it; the suggestions are at `inner[0][0][i][0]`.
- Works. [probe](https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&hl=en&gl=US) · 2026-11-19
- Same RPC as google-play-scraper `lib/suggest.js`. [practitioner](https://github.com/facundoolano/google-play-scraper) · 2026-11-19
- The legacy `market.android.com/suggest/SuggRequest` endpoint is **dead** (404). [probe](https://market.android.com/suggest/SuggRequest?json=1&c=3&query=photo&hl=en&gl=US) · 2026-11-19

**Top charts** — RPC `vyAe2` only works with the full payload from google-play-scraper `lib/list.js` (`topselling_free`, `topselling_paid`, `topgrossing`, plus a category). The category page `store/apps/category/<CAT>` is a usable unranked fallback. The old `/store/apps/top/category/…` URLs redirect.
- `vyAe2` with the full payload returns 50 package ids. [probe](https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=vyAe2) · 2026-11-19
