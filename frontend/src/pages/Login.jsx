import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Orb = ({ style, delay = 0 }) => (
  <motion.div
    style={style}
    className="absolute rounded-full"
    animate={{
      scale: [1, 1.12, 1],
      opacity: [style.opacity, style.opacity * 0.7, style.opacity],
    }}
    transition={{
      duration: 6 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      setLoading(false);
      alert("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, #0a0e1a 0%, #0d1530 40%, #111827 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .login-root * { font-family: 'DM Sans', sans-serif; }
        .login-serif { font-family: 'DM Serif Display', serif; }
        .glass-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          color: rgba(255,255,255,0.9);
        }
        .glass-input:focus {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.08);
          outline: none;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.22); }
        .btn-glow {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 0 4px 24px rgba(79,70,229,0.4), 0 0 60px rgba(79,70,229,0.1);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .btn-glow:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(79,70,229,0.6), 0 0 80px rgba(79,70,229,0.2);
          transform: translateY(-1px);
        }
        .btn-glow:disabled { opacity: 0.7; cursor: not-allowed; }
        .social-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }
        .card-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.07);
        }
      `}</style>

      <div className="login-root w-full flex items-center justify-center min-h-screen">
        {/* Mouse-follow glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
          transition={{ type: "spring", damping: 30, stiffness: 50 }}
        />

        {/* Background orbs */}
        <Orb
          delay={0}
          style={{
            top: -120,
            left: -80,
            width: 380,
            height: 380,
            background: "radial-gradient(circle, #3730a3, #1e1b4b)",
            opacity: 0.5,
            filter: "blur(1px)",
          }}
        />
        <Orb
          delay={1.5}
          style={{
            top: 80,
            left: 160,
            width: 160,
            height: 160,
            background: "radial-gradient(circle, #6366f1, #4338ca)",
            opacity: 0.35,
          }}
        />
        <Orb
          delay={3}
          style={{
            bottom: -80,
            left: 40,
            width: 280,
            height: 280,
            background: "radial-gradient(circle, #1d4ed8, #1e3a8a)",
            opacity: 0.45,
            filter: "blur(1px)",
          }}
        />
        <Orb
          delay={2}
          style={{
            top: "35%",
            right: -60,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, #7c3aed, #4c1d95)",
            opacity: 0.3,
          }}
        />
        <Orb
          delay={4}
          style={{
            bottom: "20%",
            right: "8%",
            width: 100,
            height: 100,
            background: "radial-gradient(circle, #818cf8, #6366f1)",
            opacity: 0.25,
          }}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="card-glass relative z-10 rounded-3xl w-[400px] overflow-hidden"
          style={{
            boxShadow:
              "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Top hero */}
          <div
            className="relative h-52 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1e1b4b 0%, #2e1065 35%, #1d4ed8 100%)",
            }}
          >
            <div
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.12), transparent)",
              }}
            />
            <div
              className="absolute top-4 right-14 w-20 h-20 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.08), transparent)",
              }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.07), transparent)",
              }}
            />
            <div
              className="absolute top-16 left-20 w-10 h-10 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              }}
            />

            <div className="absolute inset-0 flex flex-col justify-between p-7">
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "12px",
                  fontWeight: 500,
                  width: "fit-content",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
                }
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>

              <div>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: "#a5b4fc",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  CodeB Premium ✦
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="login-serif"
                  style={{
                    color: "white",
                    fontSize: "32px",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Welcome
                  <br />
                  <span style={{ fontStyle: "italic", color: "#c7d2fe" }}>
                    back.
                  </span>
                </motion.h1>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div style={{ padding: "28px" }}>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ marginBottom: "18px" }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    className="glass-input"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      padding: "14px 42px 14px 16px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  <svg
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "16px",
                      height: "16px",
                      color: "rgba(255,255,255,0.2)",
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ marginBottom: "18px" }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: "8px",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="glass-input"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      padding: "14px 42px 14px 16px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.25)",
                      display: "flex",
                      padding: 0,
                    }}
                  >
                    {showPass ? (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Remember + Forgot */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setRemember(!remember)}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: remember
                        ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                        : "transparent",
                      border: remember
                        ? "1px solid #6366f1"
                        : "1px solid rgba(255,255,255,0.2)",
                      boxShadow: remember
                        ? "0 0 10px rgba(99,102,241,0.4)"
                        : "none",
                      transition: "all 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <AnimatePresence>
                      {remember && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          width="10"
                          height="10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.38)",
                    }}
                  >
                    Remember me
                  </span>
                </div>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#818cf8",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </button>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow"
                  style={{
                    width: "100%",
                    color: "white",
                    padding: "15px",
                    borderRadius: "16px",
                    fontWeight: 600,
                    fontSize: "14px",
                    letterSpacing: "0.02em",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <svg
                          style={{
                            width: "16px",
                            height: "16px",
                            animation: "spin 1s linear infinite",
                          }}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="4"
                          />
                          <path
                            fill="rgba(255,255,255,0.75)"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Signing in...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Sign in →
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "22px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.22)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 500,
                }}
              >
                or continue with
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            </motion.div>

            {/* Social buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}
            >
              {/* Facebook */}
              <button
                className="social-btn"
                style={{
                  borderRadius: "12px",
                  padding: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>

              {/* Twitter/X */}
              <button
                className="social-btn"
                style={{
                  borderRadius: "12px",
                  padding: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* Google */}
              <button
                className="social-btn"
                style={{
                  borderRadius: "12px",
                  padding: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              {/* Apple */}
              <button
                className="social-btn"
                style={{
                  borderRadius: "12px",
                  padding: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </button>
            </motion.div>

            {/* Sign up */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "rgba(255,255,255,0.22)",
                marginTop: "20px",
                marginBottom: 0,
              }}
            >
              Don't have an account?{" "}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#818cf8",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                Create account
              </button>
            </motion.p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
