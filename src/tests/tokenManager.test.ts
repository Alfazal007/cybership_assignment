// src/tests/tokenManager.test.ts
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { TokenManager } from "../auth/tokenManger";
import { loadConfig, resetConfig } from "../config/config";

describe("TokenManager", () => {
    let tokenManager: TokenManager;

    beforeEach(() => {
        process.env.CLIENT_ID = "test_id";
        process.env.CLIENT_SECRET = "test_secret";
        process.env.PORT = "3000";
        tokenManager = new TokenManager()

        resetConfig();
        loadConfig();
    });

    it("should generate token", async () => {
        const token = await tokenManager.generateToken(
            "code",
            "verifier",
            "uri"
        );
        expect(token).not.toBe(null);
    });

    it("should cache token", async () => {
        await tokenManager.generateToken("code", "verifier", "uri");
        const token1 = await tokenManager.getToken();
        const token2 = await tokenManager.getToken();
        expect(token1).toBe(token2);
    });

    it("should refresh token on expiry", async () => {
        await tokenManager.generateToken("code", "verifier", "uri");
        let t1 = await tokenManager.getToken();
        await new Promise((r) => setTimeout(r, 1500));// wait till the token expires
        let t2 = await tokenManager.getToken();
        expect(t1).not.toBe(t2)
    });
});
