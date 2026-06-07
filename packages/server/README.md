# cauth server

Centralized authentication server supporting multiple services/tenants. Built with Express and [kaiauth](https://npmjs.com/package/kaiauth).

## Features

- Multi-service authentication — one server handles auth for any number of services
- Optional 2FA per service
- One-time code exchange for secure cross-origin session handoff
- Serves a web UI for login/mfa flows

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from `sample.env`:
   ```bash
   cp sample.env .env
   ```

   | Variable | Description |
   |---|---|
   | `NODE_ENV` | Set to `development` to enable dev mode (relaxes some requirements) |
   | `PORT` | Port to listen on |
   | `SESSION_SECRET` | Secret used to sign sessions (required) |
   | `DATA_DIR` | Directory where auth data is stored (required) |
   | `NOTIFY_SERVICE_URL` | URL for a notification service (2FA codes, alerts); required outside development |
   | `WEB_DEV_PORT` | Port of local web development server (required in development) |

3. Create a `config.json` from `sample.config.json`:
   ```bash
   cp sample.config.json config.json
   ```

   ```json
   {
     "services": [
       {
         "name": "my-service",
         "displayName": "My Service",
         "enable2fa": true,
         "url": "https://my-service.com"
       }
     ]
   }
   ```

   Each entry in `services` creates an isolated auth namespace at `/<name>`. Set `enable2fa: false` to disable 2FA for a service.

4. Start the server:
   ```bash
   npm run dev
   ```

## API

Each configured service exposes the following endpoints under `/api/<service-name>`:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/<service>/auth` | Log in — returns `{ code }` on success |
| `POST` | `/api/<service>/auth/2fa` | Complete 2FA — returns `{ code }` on success |
| `POST` | `/api/<service>/auth/logout` | Log out |
| `GET` | `/api/<service>/auth/verify` | Verify session — returns `{ username }` |
| `GET` | `/api/<service>/exchange?code=<code>` | Exchange a one-time code for a session ID |

Additional endpoints:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/service?name=<service>` | Get service configuration |
| `GET` | `/health` | Health check |

### Authentication

Endpoints accept either a session cookie or a `Authorization: Bearer <sessionId>` header. The bearer token is transparently converted to a cookie internally.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Build and run with watch mode |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
