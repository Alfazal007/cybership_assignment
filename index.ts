import express from "express"
import { loadConfig } from "./src/config/config";
import { ratelimiter } from "./src/config/rateLimiter";
import { authenticationMiddleware } from "./src/auth/middleware";
import { rateRouter } from "./src/router/rateRouter";
import { authRouter } from "./src/router/authRouter";
const config = loadConfig();

const app = express()

app.use(express.json())
app.use(ratelimiter)

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/rates", authenticationMiddleware, rateRouter);

app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}`);
})
