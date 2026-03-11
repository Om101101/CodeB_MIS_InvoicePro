import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ─── Token Helper ──────────────────────────────────────────────────────────────
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const setCookieToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullName, email and password are required",
      });
    }

    // Duplicate check
    const userExists = await User.findByEmail(email); // static method from model
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Create user — password auto-hashed via pre("save") hook in model
    const user = await User.create({
      fullName,
      email,
      password,
      role: role === "admin" ? "admin" : "sales", // prevent privilege escalation
    });

    const token = generateToken(user._id, user.role);
    setCookieToken(res, token);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: user.toSafeObject(), // strips password via model method
    });
  } catch (error) {
    // Mongoose duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Explicitly select password (select: false in schema)
    const user = await User.findByEmail(email).select("+password");

    // Single vague message — prevents user enumeration attacks
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Block inactive users
    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);
    setCookieToken(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};