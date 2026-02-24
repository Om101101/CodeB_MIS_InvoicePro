import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
