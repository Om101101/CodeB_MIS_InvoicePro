import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Orb = ({ style, delay = 0 }) => {
  useEffect(() => {}, [delay]);
  return (
    <div
      style={{
        ...style,
        position: "absolute",
        borderRadius: "50%",
        animation: `orbPulse ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

const FloatingParticle = ({ style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
      borderRadius: "50%",
      animation: `float ${style.duration} ease-in-out infinite`,
      animationDelay: style.delay,
    }}
  />
);

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [strength, setStrength] = useState(0);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  useEffect(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setStrength(s);
  }, [form.password]);

  // Animate step indicator on field focus
  useEffect(() => {
    if (focused === "name") setStep(0);
    else if (focused === "email") setStep(1);
    else if (focused === "password") setStep(2);
    else if (focused === "confirmPassword") setStep(3);
  }, [focused]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const strengthColors = [
    "transparent",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthTextColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        background:
          "linear-gradient(135deg, #060910 0%, #0b1120 40%, #0d1f1a 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: var(--op, 0.4); }
          50% { transform: scale(1.12); opacity: calc(var(--op, 0.4) * 0.7); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16,185,129,0.3); }
          50% { box-shadow: 0 0 40px rgba(16,185,129,0.6), 0 0 80px rgba(16,185,129,0.2); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(16,185,129,0.4); }
          50% { border-color: rgba(16,185,129,0.8); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }

        .reg-input {
          width: 100%; border-radius: 14px;
          padding: 14px 44px 14px 44px;
          font-size: 14px; box-sizing: border-box;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          color: rgba(255,255,255,0.9);
          font-family: 'DM Sans', sans-serif;
        }
        .reg-input:focus {
          background: rgba(16,185,129,0.06);
          border-color: rgba(16,185,129,0.5);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1), 0 0 30px rgba(16,185,129,0.06);
          outline: none;
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.18); }

        .btn-emerald {
          width: 100%; color: white; padding: 16px;
          border-radius: 16px; font-weight: 700; font-size: 15px;
          letter-spacing: 0.03em;
          background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
          background-size: 200% auto;
          box-shadow: 0 4px 30px rgba(16,185,129,0.4), 0 0 60px rgba(16,185,129,0.1);
          transition: all 0.4s ease;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        .btn-emerald::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .btn-emerald:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 8px 40px rgba(16,185,129,0.6), 0 0 100px rgba(16,185,129,0.2);
          transform: translateY(-2px);
        }
        .btn-emerald:disabled { opacity: 0.7; cursor: not-allowed; }

        .social-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer; border-radius: 14px;
          padding: 12px; display: flex;
          align-items: center; justify-content: center;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .card-in { animation: cardIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-up { animation: slideUp 0.6s ease forwards; opacity: 0; }
        .su-1 { animation-delay: 0.35s; }
        .su-2 { animation-delay: 0.45s; }
        .su-3 { animation-delay: 0.55s; }
        .su-4 { animation-delay: 0.62s; }
        .su-5 { animation-delay: 0.68s; }
        .su-6 { animation-delay: 0.74s; }
        .su-7 { animation-delay: 0.8s; }

        .step-dot {
          width: 8px; height: 8px; border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>

      {/* Mouse-follow glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          transform: `translate(${mousePos.x - 350}px, ${mousePos.y - 350}px)`,
          transition: "transform 0.6s ease",
          zIndex: 0,
        }}
      />

      {/* Orbs */}
      <Orb
        delay={0}
        style={{
          "--op": 0.45,
          top: -100,
          right: -80,
          width: 360,
          height: 360,
          background: "radial-gradient(circle, #064e3b, #022c22)",
          filter: "blur(2px)",
        }}
      />
      <Orb
        delay={2}
        style={{
          "--op": 0.35,
          top: 100,
          right: 140,
          width: 140,
          height: 140,
          background: "radial-gradient(circle, #10b981, #059669)",
          opacity: 0.3,
        }}
      />
      <Orb
        delay={4}
        style={{
          "--op": 0.4,
          bottom: -60,
          right: 60,
          width: 260,
          height: 260,
          background: "radial-gradient(circle, #0d9488, #134e4a)",
          filter: "blur(1px)",
        }}
      />
      <Orb
        delay={1}
        style={{
          "--op": 0.3,
          top: "30%",
          left: -50,
          width: 180,
          height: 180,
          background: "radial-gradient(circle, #065f46, #022c22)",
        }}
      />
      <Orb
        delay={3}
        style={{
          "--op": 0.2,
          bottom: "25%",
          left: "10%",
          width: 90,
          height: 90,
          background: "radial-gradient(circle, #34d399, #10b981)",
        }}
      />

      {/* Floating particles */}
      {[
        {
          top: "20%",
          left: "15%",
          width: 4,
          height: 4,
          background: "rgba(52,211,153,0.6)",
          duration: "4s",
          delay: "0s",
        },
        {
          top: "60%",
          left: "8%",
          width: 3,
          height: 3,
          background: "rgba(16,185,129,0.4)",
          duration: "5s",
          delay: "1s",
        },
        {
          top: "40%",
          right: "12%",
          width: 5,
          height: 5,
          background: "rgba(52,211,153,0.3)",
          duration: "6s",
          delay: "2s",
        },
        {
          bottom: "30%",
          right: "18%",
          width: 3,
          height: 3,
          background: "rgba(16,185,129,0.5)",
          duration: "4.5s",
          delay: "0.5s",
        },
      ].map((p, i) => (
        <FloatingParticle key={i} style={p} />
      ))}

      {/* Card */}
      <div
        className="card-in"
        style={{
          position: "relative",
          zIndex: 10,
          borderRadius: 28,
          width: 420,
          overflow: "hidden",
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(50px)",
          WebkitBackdropFilter: "blur(50px)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Hero */}
        <div
          style={{
            position: "relative",
            height: 220,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #0d9488 100%)",
          }}
        >
          {/* Decorative circles */}
          {[
            { top: -40, right: -40, width: 180, height: 180, opacity: 0.15 },
            { top: 20, right: 60, width: 80, height: 80, opacity: 0.1 },
            { bottom: -30, left: -30, width: 130, height: 130, opacity: 0.12 },
            { top: 60, left: 80, width: 40, height: 40, opacity: 0.08 },
            { bottom: 20, right: 20, width: 50, height: 50, opacity: 0.1 },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                borderRadius: "50%",
                top: c.top,
                right: c.right,
                bottom: c.bottom,
                left: c.left,
                width: c.width,
                height: c.height,
                background: `radial-gradient(circle, rgba(255,255,255,${c.opacity}), transparent)`,
              }}
            />
          ))}

          {/* Grid pattern overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 28,
            }}
          >
            {/* Back button */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 12px",
                width: "fit-content",
                transition: "all 0.2s ease",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              <svg
                width="12"
                height="12"
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
              Back to login
            </button>

            <div>
              {/* Step indicator */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="step-dot"
                    style={{
                      background:
                        i <= step ? "#34d399" : "rgba(255,255,255,0.2)",
                      width: i === step ? 24 : 8,
                      borderRadius: i === step ? 4 : "50%",
                      boxShadow:
                        i === step ? "0 0 10px rgba(52,211,153,0.8)" : "none",
                    }}
                  />
                ))}
              </div>

              <p
                style={{
                  color: "#6ee7b7",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                New Account ✦
              </p>
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  color: "white",
                  fontSize: 34,
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                Join us
                <br />
                <span style={{ fontStyle: "italic", color: "#a7f3d0" }}>
                  today.
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "28px 28px 24px" }}>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="slide-up su-1" style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: 8,
                }}
              >
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color:
                      focused === "name" ? "#10b981" : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className="reg-input"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="slide-up su-2" style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: 8,
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color:
                      focused === "email" ? "#10b981" : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="reg-input"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="slide-up su-3" style={{ marginBottom: 10 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color:
                      focused === "password"
                        ? "#10b981"
                        : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="reg-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 14,
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

              {/* Password strength */}
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 4,
                          background:
                            i <= strength
                              ? strengthColors[strength]
                              : "rgba(255,255,255,0.08)",
                          transition: "all 0.4s ease",
                          boxShadow:
                            i <= strength
                              ? `0 0 6px ${strengthColors[strength]}80`
                              : "none",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 10,
                      color: strengthTextColors[strength],
                      fontWeight: 600,
                      margin: 0,
                      transition: "color 0.3s",
                    }}
                  >
                    {strengthLabels[strength]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="slide-up su-4" style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginBottom: 8,
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    transition: "color 0.3s",
                    color:
                      form.confirmPassword.length > 0
                        ? form.password === form.confirmPassword
                          ? "#10b981"
                          : "#ef4444"
                        : focused === "confirmPassword"
                          ? "#10b981"
                          : "rgba(255,255,255,0.2)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused("confirmPassword")}
                  onBlur={() => setFocused(null)}
                  className="reg-input"
                  required
                  style={{
                    borderColor:
                      form.confirmPassword.length > 0
                        ? form.password === form.confirmPassword
                          ? "rgba(16,185,129,0.5)"
                          : "rgba(239,68,68,0.5)"
                        : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute",
                    right: 14,
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
                  {showConfirm ? (
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

                {/* Match indicator */}
                {form.confirmPassword.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      right: 44,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color:
                        form.password === form.confirmPassword
                          ? "#10b981"
                          : "#ef4444",
                      transition: "all 0.3s",
                    }}
                  >
                    {form.password === form.confirmPassword ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="slide-up su-5" style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  textAlign: "center",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                By creating an account, you agree to our{" "}
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#34d399",
                    fontWeight: 600,
                    fontSize: 11,
                    fontFamily: "'DM Sans', sans-serif",
                    padding: 0,
                  }}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#34d399",
                    fontWeight: 600,
                    fontSize: 11,
                    fontFamily: "'DM Sans', sans-serif",
                    padding: 0,
                  }}
                >
                  Privacy Policy
                </button>
              </p>
            </div>

            {/* Submit */}
            <div className="slide-up su-6">
              <button type="submit" disabled={loading} className="btn-emerald">
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <svg
                      style={{
                        width: 16,
                        height: 16,
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
                    Creating account...
                  </span>
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Create Account
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.05)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 500,
              }}
            >
              or sign up with
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.05)",
              }}
            />
          </div>

          {/* Social */}
          <div
            className="slide-up su-7"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <button className="social-btn">
              <svg width="16" height="16" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </button>
            <button className="social-btn">
              <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button className="social-btn">
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
            <button className="social-btn">
              <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>

          {/* Login link */}
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgba(255,255,255,0.2)",
              margin: 0,
            }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#34d399",
                fontWeight: 700,
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                padding: 0,
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
