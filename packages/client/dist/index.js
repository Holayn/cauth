import { Router } from 'express';
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export function createClient({ cauthUrl, cauthService, redirectUrl = '/', development = false, } = {}) {
    if (!cauthUrl) {
        throw new Error('cauthUrl is required');
    }
    if (!cauthService) {
        throw new Error('cauthService is required');
    }
    const router = Router();
    router.get('/api/auth/callback', asyncHandler(async (req, res) => {
        const { code } = req.query;
        if (!code || typeof code !== 'string') {
            res.status(400).json({ error: 'Missing code query parameter' });
            return;
        }
        const exchangeUrl = `${cauthUrl}/api/${cauthService}/exchange?code=${encodeURIComponent(code)}`;
        const response = await fetch(exchangeUrl, { method: 'POST' });
        if (!response.ok) {
            return res.status(502).json({ error: 'Failed to exchange code' });
        }
        const { sessionId } = await response.json();
        res.cookie('session', sessionId, {
            httpOnly: true,
            sameSite: 'strict',
            secure: !development,
        });
        res.redirect(redirectUrl);
    }));
    const requireAuth = asyncHandler(async (req, res, next) => {
        const response = await fetch(`${cauthUrl}/api/${cauthService}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${req.cookies.session ?? ''}`,
            },
        });
        if (response.status !== 200)
            return res.sendStatus(401);
        const data = await response.json();
        req.user = { username: data.username };
        next();
    });
    return {
        router,
        requireAuth,
    };
}
//# sourceMappingURL=index.js.map