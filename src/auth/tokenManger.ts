import { getConfig } from "../config/config";
import { AuthenticationError } from "../error/AuthenticationError";

interface TokenCache {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    refreshTokenExpiresAt: number;
}

export class TokenManager {
    private tokenCache: TokenCache | null = null;
    private tokenRefreshPromise: Promise<string> | null = null;

    async getToken(): Promise<string> {
        const now = Date.now();
        if (
            this.tokenCache &&
            this.tokenCache.expiresAt > now + 5 * 60 * 1000
        ) {
            return this.tokenCache.accessToken;
        }
        if (
            this.tokenCache &&
            this.tokenCache.refreshTokenExpiresAt < now
        ) {
            throw new AuthenticationError("Refresh token expired. Re-authentication required.");
        }
        // Prevent concurrent refresh requests
        if (this.tokenRefreshPromise) {
            return this.tokenRefreshPromise;
        }
        this.tokenRefreshPromise = this.refreshAccessToken().finally(() => {
            this.tokenRefreshPromise = null;
        });
        return this.tokenRefreshPromise;
    }

    /**
     * Refresh access token using refresh token
     */
    private async refreshAccessToken(): Promise<string> {
        if (!this.tokenCache) {
            throw new AuthenticationError("No refresh token available");
        }
        const config = getConfig();
        const credentials = Buffer.from(
            `${config.CLIENT_ID}:${config.CLIENT_SECRET}`
        ).toString("base64");
        const response = await fetch(
            "https://wwwcie.ups.com/security/v1/oauth/refresh",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${credentials}`,
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: this.tokenCache.refreshToken,
                }),
            }
        );
        if (!response.ok) {
            const errorBody = await response.text();
            throw new AuthenticationError(
                `Token refresh failed: ${response.status}`,
                { statusCode: response.status, body: errorBody }
            );
        }
        const data = await response.json() as {
            access_token: string;
            refresh_token: string;
            expires_in: string;
            refresh_token_expires_in: string;
            token_type: string;
            issued_at: string;
            refresh_token_issued_at: string;
            status: string;
        };
        // Parse expires_in as seconds and convert to ms
        const accessTokenExpiresIn = parseInt(data.expires_in, 10) * 1000;
        const refreshTokenExpiresIn = parseInt(
            data.refresh_token_expires_in,
            10
        ) * 1000;
        const now = Date.now();
        const accessTokenExpiresAt = now + accessTokenExpiresIn;
        const refreshTokenExpiresAt = now + refreshTokenExpiresIn;
        this.tokenCache = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: accessTokenExpiresAt,
            refreshTokenExpiresAt,
        };
        return data.access_token;
    }

    /**
     * Generate new token using authorization code
     * @param code - Authorization code from UPS
     * @param codeVerifier - PKCE code verifier
     * @param redirectUri - Redirect URI registered with UPS
     */
    async generateToken(
        code: string,
        codeVerifier: string,
        redirectUri: string
    ): Promise<string> {
        const config = getConfig();
        const credentials = Buffer.from(
            `${config.CLIENT_ID}:${config.CLIENT_SECRET}`
        ).toString("base64");
        const response = await fetch(
            "https://wwwcie.ups.com/security/v1/oauth/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${credentials}`,
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    code_verifier: codeVerifier,
                    client_id: config.CLIENT_ID,
                }),
            }
        );
        if (!response.ok) {
            const errorBody = await response.text();
            throw new AuthenticationError(
                `Token generation failed: ${response.status}`,
                { statusCode: response.status, body: errorBody }
            );
        }
        const data = await response.json() as {
            access_token: string;
            refresh_token: string;
            expires_in: string;
            refresh_token_expires_in: string;
            token_type: string;
            issued_at: string;
            refresh_token_issued_at: string;
            status: string;
        };
        // Parse expires_in as seconds and convert to ms
        const accessTokenExpiresIn = parseInt(data.expires_in, 10) * 1000;
        const refreshTokenExpiresIn = parseInt(
            data.refresh_token_expires_in,
            10
        ) * 1000;
        const now = Date.now();
        const accessTokenExpiresAt = now + accessTokenExpiresIn;
        const refreshTokenExpiresAt = now + refreshTokenExpiresIn;
        this.tokenCache = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: accessTokenExpiresAt,
            refreshTokenExpiresAt,
        };
        return data.access_token;
    }

    clearCache(): void {
        this.tokenCache = null;
    }
}
