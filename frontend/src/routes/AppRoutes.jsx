import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./ProtectedRoute";
import Login      from "../pages/Login";
import Register   from "../pages/Register";
import Dashboard  from "../pages/Dashboard";
import Invoices   from "../pages/Invoices";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ── Public Routes ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected Routes ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/invoices" element={
          <ProtectedRoute><Invoices /></ProtectedRoute>
        } />

        {/* ── Fallback ── */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />

      </Routes>
    </AnimatePresence>
  );
}