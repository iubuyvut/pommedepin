import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="tel:023742736"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-3.5 bg-gold text-background rounded-full shadow-lg hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] group"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Phone className="w-5 h-5 group-hover:animate-pulse" />
          <span className="font-semibold text-sm hidden sm:inline">
            02 374 27 36
          </span>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-gold/20 pointer-events-none" style={{ animationDuration: "2s" }} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
