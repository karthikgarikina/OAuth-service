import express from "express";
import cors from "cors";
import { db } from "./config/db";
import { redis } from "./config/redis";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  const health = {
    status: "ok",
    uptime: process.uptime(),
    services: {
      database: "up",
      cache: "up"
    },
    timestamp: new Date().toISOString()
  };

  try {
    await db.query("SELECT 1");
  } catch {
    health.status = "degraded";
    health.services.database = "down";
  }

  try {
    await redis.ping();
  }catch {
    health.status = "degraded";
    health.services.cache = "down";
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  return res.status(statusCode).json(health);
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
