import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-800 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-400">
        CodeB Premium
      </h1>

      <nav className="space-y-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/invoices">Invoices</Link>
      </nav>
    </div>
  );
}
