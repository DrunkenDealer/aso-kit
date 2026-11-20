#!/usr/bin/env node
// Public App Store and Google Play reads for ASO research. Prints JSON. Endpoints and caveats: plugin/skills/aso/knowledge/endpoints.md
//   store.mjs suggest ios|play <term> [--cc us] [--lang en]
//   store.mjs search  ios|play <term> [--cc us] [--lang en] [--limit 25]
//   store.mjs lookup  ios <id|bundleId> | play <package> [--cc us] [--lang en]
//   store.mjs top     ios [genreId] [--chart free|paid|grossing] | play <CATEGORY> [--cc us] [--limit 25]
//   store.mjs match   ios|play <term a> <term b> [--cc us] [--lang en] — does the store treat two spellings as one word?
//   store.mjs probe   — exercises every call; exit 1 if any fails
const [cmd, store, ...rest] = process.argv.slice(2);
const flags = Object.fromEntries(rest.flatMap((a, i) => (a.startsWith("--") ? [[a.slice(2), rest[i + 1]]] : [])));
const [arg, arg2] = rest.filter((a, i) => !a.startsWith("--") && !rest[i - 1]?.startsWith("--"));
const cc = (flags.cc ?? "us").toLowerCase();
const lang = flags.lang ?? "en";
const limit = Number(flags.limit ?? 25);

// Storefront ids for MZSearchHints; the hints endpoint returns nothing without one.
const STOREFRONT = {
  us: "143441-1", gb: "143444-2", de: "143443-4", fr: "143442-3", jp: "143462-9", es: "143454-8", it: "143450-7",
  br: "143503-15", mx: "143468-28", ca: "143455-6", au: "143460-27", ru: "143469-16", kr: "143466-13", cn: "143465-19",
  nl: "143452-10", se: "143456-17", ch: "143459-57", at: "143445-4", pl: "143478-2", tr: "143480-2", in: "143467-2",
  ua: "143492-2", pt: "143453-24", tw: "143470-18", hk: "143463-18",
};

const get = async (url, init) => {
  const r = await fetch(url, { ...init, headers: { "User-Agent": "Mozilla/5.0", ...init?.headers } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
};
const decode = (s) =>
  s.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const unique = (xs) => [...new Set(xs)];

const ios = {
  async suggest(term) {
    const sf = STOREFRONT[cc];
    if (!sf) throw new Error(`no storefront id for "${cc}" — add it to STOREFRONT`);
    const xml = await (await get(
      `https://search.itunes.apple.com/WebObjects/MZSearchHints.woa/wa/hints?clientApplication=Software&term=${encodeURIComponent(term)}`,
      { headers: { "X-Apple-Store-Front": `${sf},29` } },
    )).text();
    return [...xml.matchAll(/<key>term<\/key>\s*<string>([^<]*)<\/string>/g)].map((m) => decode(m[1]));
  },
  async search(term) {
    const j = await (await get(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&country=${cc}&limit=${limit}`)).json();
    return j.results.map((a) => ({ id: a.trackId, name: a.trackName, developer: a.artistName, rating: a.averageUserRating, ratings: a.userRatingCount }));
  },
  async lookup(id) {
    const key = /^\d+$/.test(id) ? "id" : "bundleId";
    const a = (await (await get(`https://itunes.apple.com/lookup?${key}=${encodeURIComponent(id)}&country=${cc}`)).json()).results[0];
    if (!a) throw new Error(`not found in ${cc}: ${id}`);
    const page = await get(`https://apps.apple.com/${cc}/app/id${a.trackId}`).then((r) => r.text(), () => "");
    // The first <p class="subtitle"> after the h1; "subtitle" JSON keys on the page belong to other apps and events.
    const subtitle = page.match(/<\/h1>\s*<p class="subtitle[^"]*">([^<]*)<\/p>/)?.[1]?.trim() || null;
    return {
      store: "ios", id: a.trackId, bundleId: a.bundleId, name: a.trackName, subtitle: subtitle && decode(subtitle),
      developer: a.sellerName, category: a.primaryGenreName, genres: a.genres, description: a.description,
      whatsNew: a.releaseNotes ?? null, version: a.version, updated: a.currentVersionReleaseDate,
      rating: a.averageUserRating, ratings: a.userRatingCount, languages: a.languageCodesISO2A, screenshots: a.screenshotUrls?.length ?? 0,
      gaps: ["keywords and promotional text are never public", ...(subtitle ? [] : ["subtitle not found on the product page"])],
    };
  },
  async top(genre) {
    const chart = { free: "topfreeapplications", paid: "toppaidapplications", grossing: "topgrossingapplications" }[flags.chart ?? "free"];
    const j = await (await get(`https://itunes.apple.com/${cc}/rss/${chart}/limit=${Math.min(limit, 100)}${genre ? `/genre=${genre}` : ""}/json`)).json();
    return (j.feed.entry ?? []).map((e, i) => ({ rank: i + 1, id: Number(e.id.attributes["im:id"]), name: e["im:name"].label }));
  },
};

const play = {
  async suggest(term) {
    const req = JSON.stringify([[["IJ4APc", JSON.stringify([[null, [term], [10], [2], 4]]), null, "generic"]]]);
    const body = await (await get(`https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&hl=${lang}&gl=${cc.toUpperCase()}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: `f.req=${encodeURIComponent(req)}`,
    })).text();
    const inner = JSON.parse(JSON.parse(body.replace(/^\)\]\}'/, ""))[0][2]);
    return (inner?.[0]?.[0] ?? []).map((s) => s[0]);
  },
  async search(term) {
    const html = await (await get(`https://play.google.com/store/search?q=${encodeURIComponent(term)}&c=apps&hl=${lang}&gl=${cc.toUpperCase()}`)).text();
    return unique([...html.matchAll(/\/store\/apps\/details\?id=([\w.]+)/g)].map((m) => m[1])).slice(0, limit).map((id, i) => ({ rank: i + 1, id }));
  },
  async lookup(pkg) {
    const html = await (await get(`https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}&hl=${lang}&gl=${cc.toUpperCase()}`)).text();
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1] ?? "{}");
    const full = html.match(/data-g-id="description"[^>]*>(.*?)<\/div>/s)?.[1];
    const whatsNew = [...html.matchAll(/itemprop="description">(.*?)<\/div>/gs)].map((m) => m[1]).at(-1);
    return {
      store: "play", id: pkg, title: ld.name ?? null, shortDescription: ld.description ?? null,
      fullDescription: full ? decode(full) : null, whatsNew: whatsNew ? decode(whatsNew) : null,
      category: ld.applicationCategory ?? null, developer: ld.author?.name ?? null,
      rating: ld.aggregateRating ? Number(ld.aggregateRating.ratingValue) : null, ratings: ld.aggregateRating ? Number(ld.aggregateRating.ratingCount) : null,
      gaps: [...(full ? [] : ["full description not found — markup drift?"]), "tags are not public"],
    };
  },
  // Category page: Play's own picks, not a ranked chart (the ranked RPC needs a 15 KB undocumented payload).
  async top(category) {
    if (!category) throw new Error("play top needs a category, e.g. HEALTH_AND_FITNESS");
    const html = await (await get(`https://play.google.com/store/apps/category/${category}?hl=${lang}&gl=${cc.toUpperCase()}`)).text();
    return unique([...html.matchAll(/\/store\/apps\/details\?id=([\w.]+)/g)].map((m) => m[1])).slice(0, limit).map((id) => ({ id, ranked: false }));
  },
};

// Overlap of the two top-25 result sets: a store that folds the spellings returns near-identical lists.
async function match(api, a, b) {
  const [x, y] = await Promise.all([api.search(a), api.search(b)]).then((rs) => rs.map((r) => r.map((app) => app.id)));
  const share = (n) => x.slice(0, n).filter((id) => y.slice(0, n).includes(id)).length / Math.max(1, Math.min(n, x.length, y.length));
  const overlap = share(25);
  return { a, b, results: [x.length, y.length], overlap: +overlap.toFixed(2), top10: +share(10).toFixed(2),
    verdict: overlap >= 0.7 ? "same" : overlap <= 0.3 ? "different" : "partial" };
}

async function probe() {
  const checks = [
    ["ios suggest", () => ios.suggest("habit"), (r) => r.length > 0],
    ["ios search", () => ios.search("habit tracker"), (r) => r.length > 0],
    ["ios lookup", () => ios.lookup("284882215"), (r) => r.name && r.description && r.subtitle],
    ["ios top", () => ios.top(), (r) => r.length > 0],
    ["play suggest", () => play.suggest("habit"), (r) => r.length > 0],
    ["play search", () => play.search("habit tracker"), (r) => r.length > 0],
    ["play lookup", () => play.lookup("com.duolingo"), (r) => r.title && r.shortDescription && r.fullDescription],
    ["play top", () => play.top("HEALTH_AND_FITNESS"), (r) => r.length > 0],
    ["ios match", () => match(ios, "habit tracker", "habit tracker"), (r) => r.verdict === "same"],
  ];
  let failed = 0;
  for (const [name, run, ok] of checks) {
    const result = await run().then((r) => (ok(r) ? "ok" : "empty"), (e) => e.message);
    if (result !== "ok") failed++;
    console.log(`${result === "ok" ? "✓" : "✗"} ${name}${result === "ok" ? "" : ` — ${result}`}`);
  }
  process.exit(failed ? 1 : 0);
}

if (cmd === "probe") await probe();
else if (cmd === "match") {
  const api = { ios, play }[store];
  if (!api || !arg || !arg2) {
    console.error("usage: store.mjs match ios|play <term a> <term b> [--cc us] [--lang en]");
    process.exit(2);
  }
  console.log(JSON.stringify(await match(api, arg, arg2), null, 2));
}
else {
  const api = { ios, play }[store];
  if (!api?.[cmd] || (cmd !== "top" && !arg)) {
    console.error("usage: store.mjs suggest|search|lookup|top ios|play <arg> [--cc us] [--lang en] [--limit 25] [--chart free]");
    process.exit(2);
  }
  console.log(JSON.stringify(await api[cmd](arg), null, 2));
}
