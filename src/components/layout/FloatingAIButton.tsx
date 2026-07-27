import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingAIButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6"
    >
      <Link
        to="/ai-coach"
        aria-label="Open AI Coach"
        className="group grid h-14 w-14 place-items-center rounded-full gradient-hero text-white shadow-glow ring-4 ring-background transition-transform hover:scale-110"
      >
        <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
      </Link>
    </motion.div>
  );
}
