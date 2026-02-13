import { z } from "zod";

export const RateRequestSchema = z.object({
    origin: z.object({
        postalCode: z.string(),
        countryCode: z.string(),
    }),
    destination: z.object({
        postalCode: z.string(),
        countryCode: z.string(),
    }),
    packages: z.array(
        z.object({
            dimensions: z.object({
                height: z.number(),
                width: z.number(),
                length: z.number(),
            }),
            weight: z.object({
                value: z.number(),
            }),
        })
    ).min(1, "Atleast one package required"),
});
