# chicken-coop-kitchen

Kitchen display screen for Chicken Coop — shows incoming orders to the `CUISINE` staff and lets them mark orders done.

Tauri 2 + Vue 3 + Vite, Pinia, vue-router, socket.io-client, Tailwind CSS, SweetAlert2.
Bundle id `com.chicken-coop.cyou`, product name `chickencoop`.

## Getting Started

```bash
yarn install
yarn tauri dev     # desktop app
yarn dev           # browser only
yarn tauri build   # installers
```

## Environment

Vite env vars, from `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | `chicken-coop-api` base URL used when online |
| `VITE_API_URL_OFFLINE` | Fallback base URL (LAN/local API) when `navigator.onLine` is false |

The store picks between the two at startup (`src/store.js`).

## Screens

Hash history. Signed-in users are sent to `/cuisine`; signed-out users are bounced back to `/`.

| Route | Screen |
|-------|--------|
| `/` | Login |
| `/password` | Password entry |
| `/cuisine` | Order board |

## Realtime

On login the store opens a Socket.io connection to the API authenticated with the user's `accessToken` and joins the `role:CUISINE` room. On `order:created` the order is prepended to the board with an alert (`Nouvelle commande N° …`) and the view reloads after 5s.

## Structure

- `src/views/` — `Home`, `Password`, `Cuisine`
- `src/components/` — `Header`, `Order`, `OrderCard`, `Modal`, `icons/`
- `src/store.js` — Pinia store: auth, socket, orders, alerts
- `src/assets/sounds/` — new-order sounds (`comic.mp3`, `current.mp3`)
- `src-tauri/` — Rust shell, `tauri.conf.json`
