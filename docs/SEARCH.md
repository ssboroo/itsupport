# RAINY IT search and sharing

Canonical origin: https://it.rainy.studio. Public routes: /, /services and four service pages. They share one server-rendered metadata helper, self-canonicals, a 1200×630 PNG social card, and visible Mongolian content. Sitemap is generated from the same service registry. No invented reviews, business address or prices. Dates are intentionally omitted instead of claiming every build changed the content.

## One-time Google setup
1. Deploy this branch. Open https://it.rainy.studio/google141fb7e223a0a25d.html and verify its exact response.
2. In the Search Console URL-prefix property for https://it.rainy.studio/, click Verify. Keep the file deployed permanently. For a Domain property, use Google's DNS TXT verification instead.
3. Submit https://it.rainy.studio/sitemap.xml under Sitemaps. Inspect the homepage and service URLs. Request indexing once if needed.
4. Check Pages and Performance for crawl issues, impressions, clicks and queries. Sitemap submission does not guarantee indexing or rank.

Optional GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION metadata tokens are build-time variables. The uploaded Google HTML file works without these variables. Import the verified site into Bing Webmaster Tools and submit the same sitemap.

## Automatic notifications
On relevant main-branch pushes, GitHub Actions waits for the exact commit's public seo-release.txt, checks the public IndexNow key, fetches the live sitemap, verifies allowlisted public pages and submits to IndexNow. The key is intentionally public proof of domain control, not an API secret. Failed deployments cannot submit undeployed pages. Manual workflow reruns are available after a delayed deployment. HTTP 200/202 means received, not indexed. This supports participating search engines; it is not Google's Indexing API. No recurring paid service or obsolete Google ping endpoint is used.

The Railway preparation script copies new SEO modules and writes a release marker using RAILWAY_GIT_COMMIT_SHA (or the local git commit). Other deployment paths must write the same marker before enabling the workflow. Do not deploy production notifications from a preview branch.

## Social previews
The PNG is public at /social/rainy-it.png. Every public page includes absolute Open Graph and Twitter image URLs and its own title/description/canonical. Existing Facebook/Messenger shares may retain cached cards: use https://developers.facebook.com/tools/debug/ and Scrape Again after deployment. Other platforms control their own caches and display choices. Regenerate the code-drawn PNG with `node scripts/render-social.mjs` in an environment with sharp and DejaVu Sans.

## Checks
Build the production target with `node scripts/prepare-railway.mjs`, `npm install --prefix .railway-app`, `npm run build --prefix .railway-app`. Run `node --test tests/*.test.mjs`. After deploy, run `node scripts/notify-indexnow.mjs --dry-run` to check without submitting. Admin pages carry noindex; robots excludes admin/API paths, which does not replace authentication.

No universal platform recommendation or first-place ranking is promised. Improve real service content and collect genuine customer feedback over time.
