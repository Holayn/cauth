# cauth

Centralized authentication system for multiple services. A single auth server handles login, 2FA, and session management for any number of applications via a lightweight client middleware.

## Packages

| Package | Description |
|---|---|
| [`packages/server`](packages/server) | Auth server — handles login, 2FA, and session verification |
| [`packages/client`](packages/client) | Express middleware — integrates a service with the auth server |
| [`packages/web`](packages/web) | Login/MFA web UI served by the server |

## How it works

1. A user hits a protected route on a service; the `requireAuth` middleware finds no valid session and returns `401`.
2. The service redirects the user to its `/login` route (provided by the client router), which redirects to the cauth server UI.
3. The user logs in (and completes 2FA if enabled) on the cauth web UI.
4. The server redirects back to the service's `/api/auth/callback?code=<code>`.
5. The client exchanges the one-time code for a session ID, sets a cookie, and redirects the user to their original destination.

## Getting started

Install dependencies:

```bash
npm install
```

Start the server and web UI together:

```bash
npm run dev
```

See each package's README for setup details (env vars, config files, etc.).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Run server and web UI in watch mode |
| `npm run build` | Build all packages |
| `npm run lint` | Lint all packages |
| `npm run typecheck` | Type-check all packages |
