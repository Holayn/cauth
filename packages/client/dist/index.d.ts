import { Request, Response, NextFunction } from 'express';
export declare function createClient({ cauthUrl, cauthService, redirectUrl, development, }?: {
    cauthUrl?: string;
    cauthService?: string;
    redirectUrl?: string;
    development?: boolean;
}): {
    router: import("express-serve-static-core").Router;
    requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<any>;
};
