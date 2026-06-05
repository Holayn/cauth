import { Router, Request, Response, NextFunction } from 'express';

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function createClient({ 
  cauthUrl, 
  cauthService,
  development = false,
}: { cauthUrl?: string; cauthService?: string; development?: boolean } = {}) {
  if (!cauthUrl) {
    throw new Error('cauthUrl is required');
  }
  if (!cauthService) {
    throw new Error('cauthService is required');
  }

  const router = Router();

  router.get('/auth/callback', asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Missing code query parameter' });
      return;
    }

    const exchangeUrl = `${cauthUrl}/${cauthService}/exchange?code=${encodeURIComponent(code)}`;
    const response = await fetch(exchangeUrl, { method: 'POST' });

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to exchange code' });
    }

    const { sessionId } = await response.json() as { sessionId: string };

    res.cookie('session', sessionId, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !development,
    });

    res.sendStatus(200);
  }));

  const requireAuth = asyncHandler(async (req, res, next) => {
    const response = await fetch(`${cauthUrl}/${cauthService}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${req.cookies.session ?? ''}`,
      },
    });
    if (response.status !== 200) return res.sendStatus(401);
    const data = await response.json() as { username: string };
    (req as any).user = { username: data.username };
    next();
  });

  return {
    router,
    requireAuth,
  }
}
