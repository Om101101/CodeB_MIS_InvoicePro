import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/authSlice";

// ── Animated background orb ──────────────────────────────────────────────────
const Orb = ({ style, delay = 0 }) => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const id = setInterval(
      () => setScale((s) => (s === 1 ? 1.12 : 1)),
      (6 + delay) * 1000,
    );
    return () => clearInterval(id);
  }, [delay]);
  return (
    <div
      style={{
        ...style,
        position: "absolute",
        borderRadius: "50%",
        transform: `scale(${scale})`,
        transition: `transform ${6 + delay}s ease-in-out`,
      }}
    />
  );
};

// ── Main Login Component ──────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from?.pathname || "/dashboard";
  const dispatch = useDispatch();

  const [form,     setForm]     = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse-follow glow
  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const handleChange = (e) => {
    setError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    dispatch(loginStart());

    try {
      const res = await axios.post("/auth/login", form);
      dispatch(loginSuccess(res.data));
      navigate(from, { replace: true }); // ✅ wapas usi page pe jahan se aaya tha
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Try again.";
      dispatch(loginFailure(msg));
      setError(msg);
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
          "linear-gradient(135deg, #0a0e1a 0%, #0d1530 40%, #111827 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .glass-input {
          width: 100%; border-radius: 12px;
          padding: 14px 42px 14px 16px; font-size: 14px; box-sizing: border-box;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease; color: rgba(255,255,255,0.9);
          font-family: 'DM Sans', sans-serif;
        }
        .glass-input:focus {
          background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.08);
          outline: none;
        }
        .glass-input.error-field { border-color: rgba(239,68,68,0.6); }
        .glass-input::placeholder { color: rgba(255,255,255,0.22); }
        .btn-glow {
          width: 100%; color: white; padding: 15px; border-radius: 16px;
          font-weight: 600; font-size: 14px; letter-spacing: 0.02em;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 0 4px 24px rgba(79,70,229,0.4), 0 0 60px rgba(79,70,229,0.1);
          transition: all 0.3s ease; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-glow:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(79,70,229,0.6), 0 0 80px rgba(79,70,229,0.2);
          transform: translateY(-1px);
        }
        .btn-glow:disabled { opacity: 0.7; cursor: not-allowed; }
        .social-btn {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.25s ease; cursor: pointer; border-radius: 12px;
          padding: 11px; display: flex; align-items: center; justify-content: center;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.30s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.45s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.55s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.65s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.75s; opacity: 0; }
        .card-anim { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      {/* Mouse-follow glow */}
      <div
        style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          transition: "transform 0.5s ease", zIndex: 0,
        }}
      />

      {/* Background Orbs */}
      <Orb delay={0}   style={{ top:-120, left:-80, width:380, height:380, background:"radial-gradient(circle,#3730a3,#1e1b4b)", opacity:0.5, filter:"blur(1px)" }} />
      <Orb delay={1.5} style={{ top:80, left:160, width:160, height:160, background:"radial-gradient(circle,#6366f1,#4338ca)", opacity:0.35 }} />
      <Orb delay={3}   style={{ bottom:-80, left:40, width:280, height:280, background:"radial-gradient(circle,#1d4ed8,#1e3a8a)", opacity:0.45, filter:"blur(1px)" }} />
      <Orb delay={2}   style={{ top:"35%", right:-60, width:200, height:200, background:"radial-gradient(circle,#7c3aed,#4c1d95)", opacity:0.3 }} />

      {/* ── Card ── */}
      <div
        className="card-anim"
        style={{
          position: "relative", zIndex: 10, borderRadius: 24,
          width: 400, overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Hero Banner */}
        <div
          style={{
            position: "relative", height: 200, overflow: "hidden",
            background: "linear-gradient(135deg,#1e1b4b 0%,#2e1065 35%,#1d4ed8 100%)",
          }}
        >
          <div style={{ position:"absolute", top:-32, right:-32, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,0.12),transparent)" }} />
          <div style={{ position:"absolute", top:16, right:56, width:80, height:80, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,0.08),transparent)" }} />
          <div style={{ position:"absolute", bottom:-24, left:-24, width:112, height:112, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,0.07),transparent)" }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:28 }}>
            <p style={{ color:"#a5b4fc", fontSize:11, fontWeight:500, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10 }}>
              Welcome Back ✦
            </p>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", color:"white", fontSize:32, lineHeight:1.2, margin:0 }}>
              Sign in to your<br />
              <span style={{ fontStyle:"italic", color:"#c7d2fe" }}>account.</span>
            </h1>
          </div>
        </div>

        {/* ── Form ── */}
        <div style={{ padding: 28 }}>
          <form onSubmit={handleSubmit}>

            {/* Error Banner */}
            {error && (
              <div className="shake" style={{
                marginBottom: 16, padding: "10px 14px", borderRadius: 10,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5", fontSize: 12, display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="fade-up fade-up-1" style={{ marginBottom: 18 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>
                Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  className={`glass-input${error ? " error-field" : ""}`}
                  required autoComplete="email"
                />
                <svg style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:"rgba(255,255,255,0.2)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="fade-up fade-up-2" style={{ marginBottom: 18 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} name="password"
                  placeholder="••••••••••" value={form.password}
                  onChange={handleChange}
                  className={`glass-input${error ? " error-field" : ""}`}
                  required autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.25)", display:"flex", padding:0 }}>
                  {showPass ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="fade-up fade-up-3" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => setRemember(!remember)}>
                <div style={{
                  width:16, height:16, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center",
                  background: remember ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent",
                  border: remember ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.2)",
                  boxShadow: remember ? "0 0 10px rgba(99,102,241,0.4)" : "none",
                  transition: "all 0.2s ease",
                }}>
                  {remember && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)" }}>Remember me</span>
              </div>
              <button type="button" onClick={() => navigate("/forgot-password")}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#818cf8", fontWeight:500, fontFamily:"'DM Sans',sans-serif" }}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <div className="fade-up fade-up-4">
              <button type="submit" disabled={loading} className="btn-glow">
                {loading ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <svg style={{ width:16, height:16, animation:"spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                      <path fill="rgba(255,255,255,0.75)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in →"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.22)", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:500 }}>
              or continue with
            </span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
          </div>

          {/* Social Buttons */}
          <div className="fade-up fade-up-5" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
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
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button className="social-btn">
              <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>

          {/* Sign up */}
          <p style={{ textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.22)", marginTop:20, marginBottom:0 }}>
            Don't have an account?{" "}
            <button type="button" onClick={() => navigate("/register")}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#818cf8", fontWeight:600, fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}