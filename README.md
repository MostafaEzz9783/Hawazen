# Hawazen dashboard

React dashboard with a server-side shared-account login. Financial assets are served only after session validation.

## Vercel

Import this repository and deploy `main`. The tracked `vercel.json` sets the build command and routes all requests through the authenticated server function. Keep the output directory as `vercel-public`; never publish `dist` as static assets.

Set these sensitive environment variables in the Vercel project's Settings → Environment Variables for Production (and Preview if needed):

- `AUTH_USERNAME`: the chosen account username.
- `AUTH_PASSWORD`: the chosen password.
- `SESSION_SECRET`: a random secret of at least 32 bytes. Generate one with `openssl rand -hex 32` or a password manager.

Redeploy after setting or changing environment variables. The server returns 503 until all three values exist. Credentials must never be committed or supplied as Vite client environment variables.

## Sites

The same build emits `dist/server/index.js` for Sites. Configure the same three secrets using Sites runtime settings and package the Worker using the Sites workflow.

## Checks

`node scripts/test-auth.mjs` tests server authentication using a disposable test account. `npm run build` builds the protected dashboard.
