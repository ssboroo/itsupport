FROM node:24-bookworm-slim AS build
WORKDIR /source
COPY . .
RUN node scripts/prepare-railway.mjs
WORKDIR /source/.railway-app
RUN npm install --no-audit --no-fund
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000 SQLITE_PATH=/data/orders.sqlite
COPY --from=build /source/.railway-app/.next/standalone ./
COPY --from=build /source/.railway-app/.next/static ./.next/static
COPY --from=build /source/.railway-app/public ./public
COPY --from=build /source/.railway-app/start-railway.mjs ./
COPY --from=build /source/.railway-app/lib/chat-store.mjs ./lib/chat-store.mjs
COPY --from=build /source/.railway-app/lib/telegram-bridge.mjs ./lib/telegram-bridge.mjs
EXPOSE 3000
CMD ["node","start-railway.mjs"]
