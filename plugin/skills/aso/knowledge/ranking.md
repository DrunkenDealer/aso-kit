# How the stores rank

Neither store publishes field weights. Text gets an app considered for a query. User behaviour (installs, conversion, ratings, retention) decides where it ranks.

## App Store

- Ranking = text relevance (title, subtitle, keywords, primary category) + user behaviour (downloads, ratings and reviews). [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- EU ranking parameters: engagement, number and quality of ratings, downloads, launch date, relevance of text, keywords and categories. [official](https://apps.apple.com/be/story/id1620909697) · 2026-11-19
- The production ranker optimises behavioural relevance (what users click or download per query) and textual relevance; LLM-generated relevance labels; biggest gains on tail queries. [official](https://machinelearning.apple.com/research/augmenting-app) · 2026-11-19
- "Ratings and reviews influence how your app ranks in search." [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19
- Users can search in "natural, everyday language". [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- Field order: name > subtitle > keyword field. [practitioner](https://splitmetrics.com/blog/apple-app-store-ranking-factors/) [practitioner](https://www.apptweak.com/en/aso-blog/app-store-ranking-factors) · 2026-11-19
- Earlier words in the name weigh more. [practitioner](https://appfigures.com/resources/guides/app-name-optimization) · 2026-11-19
- Apps can rank for synonyms not in their metadata. [practitioner](https://splitmetrics.com/blog/apple-app-store-ranking-factors/) · 2026-11-19
- Apps under 3.5 stars see sharply reduced visibility. [practitioner](https://www.apptweak.com/en/aso-blog/app-store-ranking-factors) · 2026-11-19
- New apps get a ranking boost in roughly their first 7 days. [practitioner](https://www.apptweak.com/en/aso-blog/how-often-should-you-update-your-app-store-metadata) · 2026-11-19
- Rankings move within a day but settle ~4 weeks after a new version. [data](https://www.apptweak.com/en/aso-blog/how-often-should-you-update-your-app-store-metadata) · 2026-11-19
- Rating prompts: max 3 per 365 days; summary rating is per territory. [official](https://developer.apple.com/app-store/product-page/) · 2026-11-19

### App Store Tags

- LLM-generated from en-US metadata plus human curation; US only; developers can deselect but not add; clickable in search and on the product page. [official](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-tags) · 2026-11-19
- Apple makes no claim that tags affect ranking. [official](https://developer.apple.com/app-store/search/) · 2026-11-19
- You steer tags only through accurate en-US metadata. Re-check the tag options after every metadata change. [practitioner](https://www.gummicube.com/blog/new-apple-app-tags-explained/) · 2026-11-19

### Other Apple AI surfaces

- AI review summaries: US since iOS 18.4, plus AU, CA, IN, IE, NZ, SG, ZA, UK. [official](https://developer.apple.com/app-store/whats-new/) · 2026-11-19
- Personalized Collections with a per-app explanation, limited rollout. [official](https://developer.apple.com/app-store/whats-new/) · 2026-11-19

## Google Play

- "Apps are ranked based on a combination of ratings, reviews, downloads, and other factors"; search "factors in the overall experience … based on user behavior and feedback". [official](https://support.google.com/googleplay/android-developer/answer/4448378) · 2026-11-19
- Android vitals affect visibility. Bad-behaviour thresholds: crash rate 1.09% overall / 8% per device; ANR rate 0.47% / 8%; excessive wake locks 5%. [official](https://developer.android.com/google/play/vitals) · 2026-11-19
- Wake-lock enforcement since 2026-03-01; memory and DEX metrics may affect visibility from Feb 2027. [official](https://android-developers.googleblog.com/2025/11/raising-bar-on-battery-performance.html) [official](https://developer.android.com/google/play/vitals) · 2026-11-19
- Title carries the most text weight; repeat main keywords "a few times". [practitioner](https://www.apptweak.com/en/aso-blog/google-play-ranking-factors) · 2026-11-19
- Install velocity, recency and retention matter; uninstalls count against. [practitioner](https://www.apptweak.com/en/aso-blog/google-play-ranking-factors) [practitioner](https://trysonar.app/blog/how-play-store-ranking-works) · 2026-11-19
- Play NLP reads semantic relationships, not counts; repetitive phrasing can hurt. [practitioner](https://www.moburst.com/blog/app-store-algorithm-changes-what-changed-and-how-to-adapt/) · 2026-11-19
- **Disputed** — review text indexed for keywords. For: [practitioner](https://www.mobileaction.co/blog/google-play-store-ranking-factors/). Google confirms only that Ask Play summarises reviews. [official](https://android-developers.googleblog.com/2026/10/new-tools-for-discovery-and-engagement.html) · 2026-11-19
- Settles ~3 weeks after a change; wait 6–8 weeks between text changes. [data](https://www.apptweak.com/en/aso-blog/how-often-should-you-update-your-app-store-metadata) · 2026-11-19

### Ask Play, Guided Search, Gemini

- Ask Play "summarizes your store listing and user reviews"; side-by-side comparisons in search (Oct 2026). [official](https://android-developers.googleblog.com/2026/10/new-tools-for-discovery-and-engagement.html) · 2026-11-19
- "Gemini matches their request to your store listing and key features." [official](https://android-developers.googleblog.com/2026/10/new-tools-for-discovery-and-engagement.html) · 2026-11-19
- Guided Search sorts goal-style queries into categories (Sep 2025). [official](https://blog.google/products/google-play/curation-update-september-2025/) · 2026-11-19
- On conversational queries organic results start around screen 4; short and mid-tail queries are less affected; mostly US English. [practitioner](https://www.apptweak.com/en/aso-blog/google-i-o-2026-aso-updates) · 2026-11-19
- The long description is the main source for Ask Play highlights; rating doesn't set the order. [practitioner](https://www.apptweak.com/en/aso-blog/how-to-get-recommended-by-ask-play-google-play) · 2026-11-19
- Ask Play also reads the developer's website. [practitioner](https://www.apptweak.com/en/aso-blog/google-i-o-2026-aso-updates) · 2026-11-19
- No Console field, opt-out or report exists for Ask Play. [practitioner](https://testerbee.com/blog/ask-play-what-google-says-it-reads-and-what-it-doesnt) · 2026-11-19

## LLM assistants (ChatGPT, Gemini, Perplexity)

- Store pages are 47.5% of citations when ChatGPT recommends apps (App Store 38%, Play 9.5%); recommendations correlate only loosely with store rank. [data](https://www.apptweak.com/en/aso-blog/how-ai-engines-decide-which-app-to-recommend) · 2026-11-19
- A clear positioning sentence, a named audience and consistent feature names across listing and website help AI surfaces. [practitioner](https://www.apptweak.com/en/aso-blog/optimize-app-store-listing-for-ai-search) · 2026-11-19

## What this means for text

1. Relevance gets you in, conversion keeps you up. A keyword the listing can't convert on drops back.
2. Write each field so a human converts and an LLM can classify the app: what it is, who it is for, the job it does.
3. Change one thing at a time and wait for it to settle (iOS ~4 weeks, Play 6–8 weeks) before you judge it.
4. Below a 4.0 rating, fix ratings before you spend effort on keywords.
