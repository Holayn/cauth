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
   | `PORT` | Port to listen on |
   | `SESSION_SECRET` | Secret used to sign sessions (required) |
   | `DATA_DIR` | Directory where auth data is stored (required) |
   | `NOTIFY_SERVICE_URL` | Optional URL for a notification service (2FA codes, alerts) |

3. Create a `config.json` from `sample.config.json`:
   ```bash
   cp sample.config.json config.json
   ```

   ```json
   {
     "services": [
       {
         "name": "my-service",
         "enable2fa": true
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

Each configured service exposes the following endpoints under `/<service-name>`:

| Method | Path | Description |
|---|---|---|
| `POST` | `/<service>/auth` | Log in |
| `POST` | `/<service>/auth/2fa` | Complete 2FA |
| `POST` | `/<service>/auth/logout` | Log out |
| `GET` | `/<service>/auth/verify` | Verify session — returns `{ username }` |
| `POST` | `/<service>/exchange` | Exchange a one-time code for a session ID |

Additional endpoints:

| Method | Path | Description |
|---|---|---|
| `GET` | `/service?name=<service>` | Get service configuration |

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Build and run with watch mode |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
