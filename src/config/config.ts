import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    CLIENT_ID: z.string(),
    CLIENT_SECRET: z.string(),
});

type Environment = z.infer<typeof envSchema>;

let config: Environment | null = null;

export function loadConfig(): Environment {
    if (config) return config;
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("Environment validation failed:");
        throw new Error("Invalid environment configuration");
    }
    config = parsed.data;
    return config;
}

export function getConfig(): Environment {
    if (!config) throw new Error("Config not loaded. Call loadConfig first.");
    return config;
}

export function resetConfig(): void {
    config = null;
}
