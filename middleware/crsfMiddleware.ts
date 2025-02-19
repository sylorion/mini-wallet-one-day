import { Request, Response, NextFunction } from "express";
import csrf from "csurf"

const csrfProtection = csrf({ cookie: true });
export const xrfToken=async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    if (req.csrfToken) {
        res.cookie("XSRF-TOKEN", req.csrfToken());
    }
    next();
}

export const Csrf=async(req: Request, res: Response, next: NextFunction):Promise<any> => {
    if (req.path.startsWith("/api/users") || req.path.startsWith("/api/users/auth/login")) {
        return next();
    }
    csrfProtection(req, res, next);
}