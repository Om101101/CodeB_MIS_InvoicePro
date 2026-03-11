import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation(); // login ke baad wapas same page pe bhejne ke liye

  // Token check ho raha hai — spinner dikhao
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
      }}>
        <div style={{ textAlign: "center" }}>
          <svg
            style={{ width: 32, height: 32, animation: "spin 1s linear infinite", color: "#6366f1" }}
            fill="none" viewBox="0 0 24 24"
          >
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.25)" strokeWidth="4" />
            <path fill="#6366f1" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated nahi — login pe bhejo, aur current path save karo
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated — page dikhao
  return children;
}