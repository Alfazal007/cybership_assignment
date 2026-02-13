export class CarrierError extends Error {
    constructor(
        public code: string,
        public statusCode: number,
        message: string,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = "CarrierError";
    }
}

export class AuthenticationError extends CarrierError {
    constructor(message: string, details?: Record<string, unknown>) {
        super("AUTH_ERROR", 401, message, details);
        this.name = "AuthenticationError";
    }
}
