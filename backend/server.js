import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS middleware (VERY IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// ✅ JSON middleware
app.use(express.json());

// ✅ Cookie parser
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000 🚀"));
