import { Router } from "express";
import { register, login, refresh } from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", refresh);

export default router;
