# Visitor tracking

The website uses the [Upstash Redis TypeScript SDK](https://upstash.com/docs/redis/sdks/ts/overview).

1. Connect your Upstash Redis installation to the florii Vercel project.
2. Make sure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are available to the deployment. The integration's `KV_REST_API_URL` and `KV_REST_API_TOKEN` names also work. Use the write token, not the read-only token.
3. For local development, run `vercel link` and `vercel env pull .env.development.local`, or copy the Redis variables from `.env.example` into your local environment. Keep credentials out of Git and browser code.
4. Redeploy and visit a public page to see the live visitor count in the header badge.

The header displays the approximate all-time unique browser count. Counts start at zero; the old placeholder of 13 is not imported. Daily aggregates expire after 90 days. All-time aggregates have no expiry. No admin setup is needed for visitor tracking.

Each browser gets a random local-storage identifier. Redis HyperLogLog records approximate unique counts without retaining raw identifiers. Reloading adds a page view without adding a unique browser; navigating to another pathname adds another page view. Query-string and hash-only changes are not counted. Clearing storage or switching browsers counts again. Duplicate event delivery is ignored for five minutes.

Admin pages, browsers with Do Not Track or Global Privacy Control, and browsers that disallow storage are excluded. Missing credentials or Redis outages do not prevent pages loading; the header shows an unavailable state when no count can be read. No IP addresses, referrers, or page URLs are stored for analytics. These are basic browser statistics, not bot-proof or billing-grade measurements; a scripted client can inflate them.

Only the total visitor count is public at `GET /api/visitors`. `POST /api/visitors` accepts same-origin JSON containing UUID v4 `visitorId` and `eventId` fields.
