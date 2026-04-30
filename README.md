# MerkatoAI

MerkatoAI is a wholesale concierge platform for Ethiopia.

It helps wholesalers digitize inventory notes with Gemini, and helps buyers search live inventory and subscribe to wishlist alerts through Telegram.

## Stack

- Frontend: React 18 + Tailwind (`client/`)
- Backend: Node.js + Express (`server/`)
- Database: Supabase (PostgreSQL)
- AI: Gemini via `@google/generative-ai`
- Messaging: Telegram bot via Telegraf

## Monorepo Structure

- `client/` - dashboard UI and inventory upload flow
- `server/` - API, Telegram bot, use cases, repositories
- `package.json` (root) - combined scripts for running both apps

## Prerequisites

- Node.js `>=20 <21`
- npm
- Supabase project (URL + anon key)
- Gemini API key
- Telegram bot token

## Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` and fill values:

```env
PORT=5050
NODE_ENV=development

SUPABASE_URL=
SUPABASE_ANON_KEY=

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash

TELEGRAM_MODE=polling
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_URL=https://your-host.example.com/api/webhook/telegram

DEFAULT_WHOLESALER_ID=<uuid>
TEST_WHOLESALER_ID=
```

### Client (`client/.env`)

Copy `client/.env.example`:

```env
REACT_APP_API_BASE_URL=/api
REACT_APP_WHOLESALER_ID=<uuid>
```

Notes:
- The client runs on port `3030`.
- API proxy is configured to `http://localhost:5050`.
- `REACT_APP_WHOLESALER_ID` is used by the inventory "Confirm & save" flow.

## Install

From repo root:

```bash
npm run install:all
```

## Run (Development)

Start both server and client:

```bash
npm start
```

Local URLs:
- Client: `http://localhost:3030`
- Server: `http://localhost:5050`

## Core Features

- AI inventory extraction preview (`POST /api/inventory/extract`)
- Confirm/save inventory to Supabase (`POST /api/inventory/save`)
- Inventory listing for dashboard (`GET /api/inventory`)
- Dashboard stats endpoint (`GET /api/stats`)
- Telegram buyer search and auto-wishlist on no match
- Telegram wholesaler inventory upload using `Inventory:` prefix

## API Routes

Base server URL: `http://localhost:5050`

- `POST /api/inventory/extract` - parse raw note text using Gemini
- `POST /api/inventory/save` - save confirmed extracted items
- `POST /api/inventory` - process + save in one request
- `GET /api/inventory` - list recent inventory
- `GET /api/stats` - dashboard totals
- `GET /api/feed` - live feed placeholder
- `GET /api/wishlist` - list wishlist entries
- `GET /api/wishlist/cron/check-matches` - run wishlist matching
- `POST /api/webhook/telegram` - Telegram webhook endpoint

## Telegram Usage

Bot commands:

- `/start`
- `/help`
- `/wishlist`
- `/add <item>`

Text behavior:

- `Inventory: ...` => wholesaler upload flow
- Any other text => buyer search flow
- If no results are found, bot automatically adds item to wishlist

## Troubleshooting

- **Gemini extraction fails**: check `GEMINI_API_KEY`, model name, and quota.
- **Telegram 409 conflict**: only one polling bot process should run per token.
- **Wholesaler ID warning in UI**: ensure `REACT_APP_WHOLESALER_ID` is set and restart client.
- **Push/auth issues**: verify Git remote URL and GitHub account permissions.

## Scripts

### Root

- `npm start` - run server + client together
- `npm run dev` - dev mode (concurrently)
- `npm run build` - build client
- `npm run install:all` - install root/server/client dependencies

### Server

- `npm run start` - start API + bot
- `npm run dev` - start with nodemon

### Client

- `npm start` - run React app on port 3030
- `npm run build` - production build

## License

Private/internal project.
