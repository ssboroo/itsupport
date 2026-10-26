# IT ТУСЛАМЖ — RAINY

Монгол хэлтэй компьютерийн зайны үйлчилгээний захиалгын сайт. Responsive blue/white UI, 8 service categories, AnyDesk/UltraViewer download and setup guides, Telegram notifications, Messenger and Viber contact links.

## Stack

React 19, TypeScript, Vinext/Vite, Cloudflare Workers, D1/Drizzle. This repository mirrors the source of the hosted Sites project. It is **not a GitHub Pages static site**: order storage and authentication need the Worker runtime and the Sites identity gateway.

## Local development

Use Node.js 22.13+ and pnpm. Run `pnpm install` then `pnpm dev`. Build with `pnpm build`. The hosted database migration is in `drizzle/`; local preview data is separate. Configure local bindings using the supplied Vite/Cloudflare configuration. Local development identity mocks must never be treated as production authentication.

## Runtime configuration

Set these values in the hosting service's secret/environment configuration, never in browser code or Git:

- `ADMIN_EMAIL`: authenticated ChatGPT email permitted to access `/admin` and order management API. Until configured, admin access is denied.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`: optional new-order notifications. Never commit the token.
- `TELEGRAM_USERNAME`: optional public bot/contact username, without `@`.
- `FACEBOOK_PAGE_ID`: public numeric Page ID for the Messenger button.
- `VIBER_CHAT_URL`: official Viber Business chat link or bot deeplink. Until configured, the button offers website booking instead.

The current hosted Site is owner-private. Opening the GitHub repository does not make the Site public or configure these integrations. Customer booking currently requires ChatGPT sign-in. External hosting needs its own trusted authentication gateway; do not trust user-supplied identity headers on an unprotected standalone server.

## Access control

The public navigation contains no admin link. `/admin` checks identity and `ADMIN_EMAIL` server-side; unauthorized visitors receive no dashboard. GET/PATCH `/api/orders` enforce the same authorization. Hiding a link is not the security boundary. Orders are stored in D1 and never in the browser. Do not enter AnyDesk/UltraViewer passwords, bank passwords, or OTPs in order descriptions.

## Remote support guides

Official downloads and instructions:

- https://anydesk.com/en/downloads/windows
- https://support.anydesk.com/connect-to-a-remote-client
- https://www.ultraviewer.net/en/download.html
- https://www.ultraviewer.net/en/faq.html?filter=using

## Assets

`public/hero-laptop.webp` is an AI-generated project asset. The header animation and service icons are implemented in CSS and Lucide React. Motion respects `prefers-reduced-motion`.
