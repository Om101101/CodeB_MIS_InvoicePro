import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold"
      >
        Dashboard 🚀
      </motion.h1>
    </MainLayout>
  );
}
