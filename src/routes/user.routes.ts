import { Router } from "express";
import {
  getMe,
  updateMe,
  listUsers
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.get("/", authMiddleware, requireRole("admin"), listUsers);

export default router;
