import { Router, type Request, type Response } from "express";
import { RateRequestSchema } from "../schema/RequestSchema";
import { getRate } from "../UpsService/UpsService";

const rateRouter = Router()

rateRouter.post("/shop", async (req: Request, res: Response) => {
    try {
        const validation = RateRequestSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid request",
                    details: validation.error.flatten(),
                },
            });
            return;
        }
        // Get rates from UPS service
        const response = await getRate(validation.data);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in /rates/shop:", error);
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Failed to get rates",
                details: error instanceof Error ? error.message : String(error),
            },
        });
    }
});

export {
    rateRouter
}
