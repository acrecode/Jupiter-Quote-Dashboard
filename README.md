# Jupiter quote dashboard

Small Vite app that watches Jupiter quotes and draws the route. Nothing fancy on the backend because there is no backend. It hits the free lite quote API from the browser.

## Run it

```bash
npm install
npm run dev
```

Open whatever Vite prints. Usually:

```bash
http://127.0.0.1:5173/
```

Build check:

```bash
npm run build
npm run lint
```

## What it does

- polls Jupiter quotes once a second
- starts with `SOL -> USDC`, `USDC -> SOL`, and `SOL -> JUP`
- shows the best out amount, route, impact, and fees
- stores pairs/settings in localStorage
- pause button actually stops polling
- camera button exports the quote + route area as a png

Shortcuts:

```text
p   pause/resume
s   swap active pair
1-9 jump pair tabs
?   shortcut popup
```

## Notes

The quote endpoint is:

```text
https://lite-api.jup.ag/swap/v1/quote
```

No key needed.

The token list situation is annoying. The old spec said to use:

```text
https://tokens.jup.ag/tokens?tags=verified
```

That did not resolve from my environment, and current Jupiter docs point at the newer Tokens API under `api.jup.ag`, which wants an API key. So the app still tries the old endpoint, but it has fallback metadata for SOL, USDC, and JUP so the default dashboard is not ugly if the token list fails.

Also the quote response is not exactly like the old sample. `platformFee` can be `null`, and route fees are not always included. The types allow that.

## Files worth looking at

```text
src/api/jupiter.ts       quote client
src/api/tokens.ts        token list + fallbacks
src/store/pairs.ts       persisted pairs
src/store/settings.ts    pause/slippage
src/App.tsx              main wiring
src/styles/globals.css   the whole look
```

That is pretty much it.
