# Railway deployment

The root Dockerfile builds a separate standard Next.js application from the same UI. The Sites/Cloudflare deployment remains supported by the original source files. `node scripts/prepare-railway.mjs` prepares the ignored `.railway-app` directory.

Railway settings:
- Port: 3000; health check: `/api/config`.
- Attach a persistent volume at `/data`; SQLite runs in WAL mode at `/data/orders.sqlite`.
- Run one replica with this SQLite volume.
- Set `SITE_URL` to the public HTTPS origin (no trailing slash) for CSRF checks.
- Set `ADMIN_USERNAME` and a strong `ADMIN_PASSWORD`. `/admin` uses HTTP Basic authentication over HTTPS; the same credentials protect order reads and updates. Optional `ADMIN_EMAIL` defaults to `admin@rainy.studio`.
- `BOOKING_ID_SECRET` salts anonymous booking rate-limit identities. ChatGPT identity headers are never trusted on this host. Visitors can leave requests without an account.
- Contact variables: `FACEBOOK_PAGE_USERNAME`, `TELEGRAM_USERNAME`, `VIBER_PHONE`, `CONTACT_PHONE`.
- Telegram order notifications additionally require `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Contact links alone do not enable bot notifications.

This new deployment starts with a separate database; it does not copy existing Cloudflare D1 records. Back up the Railway volume/database before database maintenance. Keep credential values out of source control.

## Two-way website support chat

The floating chat widget posts to `/api/support/chat`. Each visitor receives an opaque HttpOnly cookie; only its SHA-256 hash is stored. Conversations, Telegram message mappings, inbound update IDs, and the outgoing retry queue live in the persistent SQLite database. API reads use private/no-store caching, and writes require a configured same-site origin, bounded text, an idempotency key, and a per-IP limit.

`start-railway.mjs` starts both the Next.js server and the Telegram bridge. The bridge uses `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` already used for order notifications. Reply to a **💬 RAINY IT · Шууд тусламж** message in Telegram to send plain text back to that visitor's website chat. Replies from other Telegram chats are ignored. Replies to order notifications are not website-chat replies. Only text is supported in this version.

Use a bot dedicated to this website. The bridge does not delete an existing webhook; if one is configured, it reports a safe error in runtime logs and keeps outgoing messages queued/retrying as appropriate. Another getUpdates consumer must not run on this bot. Telegram failures keep visitor messages queued with capped exponential retry. Outgoing delivery is at-least-once: a process interruption immediately after Telegram accepts a send can cause a duplicate Telegram notification, while inbound update IDs prevent duplicate website replies.

Run one replica. Visitors should keep the same browser to retain their private conversation cookie. No separate Telegram webhook URL or webhook secret is required.
