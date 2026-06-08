import { Request, Response, NextFunction } from 'express';
export declare function createClient({ cauthUrl, cauthService, redirectUrl, apiToken, development, }: {
    cauthUrl?: string;
    cauthService?: string;
    redirectUrl?: string;
    apiToken: string;
    development?: boolean;
}): {
    router: import("express-serve-static-core").Router;
    requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<any>;
};
