import express from "express";
import {
  register,
  login,
  logout,
} from "../controllers/authController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // logout controller already handles cookie clear

// ─── Protected Routes ──────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ─── Admin Only Routes ─────────────────────────────────────────────────────────
router.get("/users", protect, restrictTo("admin"), async (req, res) => {
  try {
    const users = await User.findActiveUsers(); // static method from model
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;