import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Token Extractor Helper ────────────────────────────────────────────────────
const extractToken = (req) => {
  if (req.cookies?.token) return req.cookies.token;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];

  return null;
};

// ─── Protect: Verify JWT + Load User ──────────────────────────────────────────
export const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in.",
      });
    }

    // Throws if expired or invalid — caught below
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Always fetch fresh user — decoded payload could be stale
    const user = await User.findById(decoded.id).select("+status +role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please register.",
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    req.user = user.toSafeObject(); // password-free user attached to request
    next();
  } catch (error) {
    const MESSAGE_MAP = {
      TokenExpiredError: "Session expired. Please log in again.",
      JsonWebTokenError: "Invalid token. Please log in.",
      NotBeforeError: "Token not yet active.",
    };

    return res.status(401).json({
      success: false,
      message: MESSAGE_MAP[error.name] ?? "Authentication failed.",
    });
  }
};

// ─── restrictTo: Role-Based Guard ─────────────────────────────────────────────
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access restricted to: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

// ─── optionalAuth: Attach user if token exists, never block ───────────────────
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next(); // no token = guest, continue

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user?.status) req.user = user.toSafeObject();
  } catch {
    // silently ignore — optional means non-blocking
  }
  next();
};