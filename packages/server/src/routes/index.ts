import { Router } from 'express';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';
import { sign as signCookie } from 'cookie-signature';
import { createAuthRouter } from 'kaiauth';
import { SESSION_SECRET, DATA_DIR, WEB_DEV_PORT, isDevelopment } from '../config/env.js';
import { getServices } from '../config/services.js';
import { notify } from '../services/notify.js';
import { getDirname } from '../util/path.js';

const services = getServices();

const router = Router();

// Bearer to cookie shim middleware - kaiauth operates on cookies.
router.use((req, res, next) => {
  const token = req.headers.authorization?.slice(7);
  if (token) {
    const parsed = parseCookie(req.headers.cookie ?? '');
    parsed.session = 's:' + signCookie(token, SESSION_SECRET);
    req.headers.cookie = Object.entries(parsed).map(([k, v]) => serializeCookie(k, v)).join('; ');
  }
  next();
});

services.forEach(({ name, enable2fa = true }) => {
  fs.mkdirSync(path.join(DATA_DIR, name), { recursive: true });

  const exchangeCodes = new Map<string, string>();

  const { router: authRouter } = createAuthRouter({
    authDataDir: path.join(DATA_DIR, name),
    sessionSecret: SESSION_SECRET,
    enable2fa,
    buildCookieOptions: (extra) => ({
      httpOnly: true,
      sameSite: 'strict',
      secure: !isDevelopment,
      ...extra,
    }),
    notify: (message, username) => {
      notify(`[${name}]: ${message}`, { user: username || '' });
    },
  });

  router.use(`/api/${name}`, (req, res, next) => {
    const isLoginRoute = req.path === '/auth' || req.path === '/auth/2fa';
    if (isLoginRoute) {
      const origSendStatus = res.sendStatus.bind(res);
      res.sendStatus = (status: number) => {
        if (status === 200) {
          const code = randomUUID();
          const sessionId = req.sessionID;
          exchangeCodes.set(code, sessionId);
          setTimeout(() => {
            exchangeCodes.delete(code);
          }, 30 * 1000).unref();
          return res.status(200).json({ code });
        }
        return origSendStatus(status)
      }
    }

    next();
  });

  router.use(`/api/${name}/auth/verify`, (req, res, next) => {
    const origSendStatus = res.sendStatus.bind(res);
    res.sendStatus = (status: number) => {
      if (status === 200) {
        return res.status(200).json({ username: req.session.user?.username });
      }
      return origSendStatus(status);
    };
    next();
  });

  router.use(`/api/${name}/exchange`, (req, res) => {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }
    const sessionId = exchangeCodes.get(code);
    if (!sessionId) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    exchangeCodes.delete(code as string);
    return res.json({ sessionId });
  });

  router.use(`/api/${name}`, authRouter);
});

if (isDevelopment) {
  router.get('/', (req, res) => {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(`http://localhost:${WEB_DEV_PORT}${query}`);
  });
} else {
  router.use('/', express.static(path.join(getDirname(import.meta.url), '../../../web/dist')));
}
router.get('/api/service', (req, res) => {
  console.log('Query:', req.query);
  const service = services.find((s) => s.name === req.query.name);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

export default router;
