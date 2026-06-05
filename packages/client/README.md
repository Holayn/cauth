# cauth client

Express middleware for integrating with a [cauth server](../server).

## Installation

```bash
npm install cauth-client
```

## Usage

```ts
import { createClient } from 'cauth-client';

const { router, requireAuth } = createClient({
  cauthUrl: 'https://your-cauth-server.example.com',
  cauthService: 'my-service',
});

// Mount the auth callback route
app.use(router);

// Protect routes
app.get('/dashboard', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
```

## API

### `createClient(options)`

| Option | Type | Required | Description |
|---|---|---|---|
| `cauthUrl` | `string` | yes | Base URL of the cauth server |
| `cauthService` | `string` | yes | Service name as configured on the cauth server |
| `development` | `boolean` | no | Disables `secure` flag on session cookies (default: `false`) |

Returns `{ router, requireAuth }`.

#### `router`

An Express router that handles `GET /auth/callback`. When the cauth server redirects back after login, this endpoint exchanges the one-time code for a session ID and sets a `session` cookie.

#### `requireAuth`

Express middleware that validates the session cookie against the cauth server. On success it attaches `req.user = { username }` and calls `next()`. On failure it responds with `401`.

## Building

```bash
npm run build
```
