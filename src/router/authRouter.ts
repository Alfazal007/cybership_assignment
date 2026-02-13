import { Router, type Request, type Response } from "express";
import { getTokenManager } from "../auth/middleware";
import { AuthenticationError } from "../error/AuthenticationError";

const authRouter = Router();

authRouter.post("/callback", async (req: Request, res: Response) => {
    try {
        const { code, code_verifier, redirect_uri } = req.body;
        if (!code || !code_verifier || !redirect_uri) {
            res.status(400).json({
                error: {
                    code: "INVALID_REQUEST",
                    message: "Missing: code, code_verifier, redirect_uri",
                },
            });
            return;
        }
        const tokenManager = getTokenManager();
        const token = await tokenManager.generateToken(
            code,
            code_verifier,
            redirect_uri
        );
        res.status(200).json({ success: true, accessToken: token });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            res.status(error.statusCode).json({ error });
            return;
        }
        res.status(500).json({ error: { code: "INTERNAL_ERROR" } });
    }
});

export { authRouter };
