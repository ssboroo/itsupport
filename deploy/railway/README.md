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
