import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// ─── Env Config (sabse pehle) ──────────────────────────────────────────────────
dotenv.config();

const requiredEnvVars = ["JWT_SECRET", "MONGO_URI", "CLIENT_URL"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1); // crash early — better than silent failures
  }
});

// ─── DB Connect ────────────────────────────────────────────────────────────────
await connectDB();

// ─── App Init ─────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet()); // sets secure HTTP headers

app.use(
  cors({
    origin: process.env.CLIENT_URL,  // hardcode nahi, env se
    credentials: true,               // cookies allow
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── General Middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));        // large payload attack se bachao
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging (only in development) ────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy ✅",
    env: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("💥 Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});