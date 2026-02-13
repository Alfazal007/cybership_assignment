import { describe, it, expect } from "bun:test";
import { RateRequestSchema } from "../schema/RequestSchema";

describe("Validation", () => {
    it("valid request passes", () => {
        const result = RateRequestSchema.safeParse({
            origin: { postalCode: "10001", countryCode: "US" },
            destination: { postalCode: "90210", countryCode: "US" },
            packages: [
                { dimensions: { height: 10, width: 10, length: 10 }, weight: { value: 5 } },
            ],
        });
        expect(result.success).toBe(true);
    });

    it("missing postalCode fails", () => {
        const result = RateRequestSchema.safeParse({
            origin: { countryCode: "US" },
            destination: { postalCode: "90210", countryCode: "US" },
            packages: [],
        });
        expect(result.success).toBe(false);
    });

    it("empty packages fails", () => {
        const result = RateRequestSchema.safeParse({
            origin: { postalCode: "10001", countryCode: "US" },
            destination: { postalCode: "90210", countryCode: "US" },
            packages: [],
        });
        expect(result.success).toBe(false);
    });
});
