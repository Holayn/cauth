import { Request, Response, NextFunction } from 'express';
export declare function createClient({ cauthUrl, cauthService, development, }?: {
    cauthUrl?: string;
    cauthService?: string;
    development?: boolean;
}): {
    router: import("express-serve-static-core").Router;
    requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<any>;
};
