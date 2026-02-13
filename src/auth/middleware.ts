import type { NextFunction, Request, Response } from "express";
import { TokenManager } from "./tokenManger";
import { AuthenticationError } from "../error/AuthenticationError";

const tokenManager = new TokenManager();

/**
 * Authentication middleware - ensures valid UPS token is available
 * Handles token refresh transparently
 */
export async function authenticationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = await tokenManager.getToken();
        // Attach token to request for downstream use
        (req as any).token = token;
        // Add authorization header for UPS API calls
        req.headers.authorization = `Bearer ${token}`;
        next();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            res.status(error.statusCode).json({
                error: {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                },
            });
            return;
        }
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Authentication middleware failed",
            },
        });
    }
}

export function getTokenManager(): TokenManager {
    return tokenManager;
}
