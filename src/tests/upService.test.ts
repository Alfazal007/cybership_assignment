// src/tests/upsService.test.ts
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { getRate } from "../UpsService/UpsService";
import { getTokenManager } from "../auth/middleware";
import { loadConfig, resetConfig } from "../config/config";

describe("UPS Service", () => {
    beforeEach(() => {
        getTokenManager().clearCache();

        resetConfig();
        loadConfig();
    });

    it("should make request to UPS API", async () => {
        await getTokenManager().generateToken("code", "verifier", "uri");
        const result = await getRate({
            origin: { postalCode: "10001", countryCode: "US" },
            destination: { postalCode: "90210", countryCode: "US" },
            packages: [
                { dimensions: { height: 10, width: 10, length: 10 }, weight: { value: 5 } },
            ],
        });
        expect(result).toBeDefined();
    });
});
