'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/hero-pizza-VfREaST9G2JTFrxvuYtYgW.webp";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen bg-cream overflow-hidden pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center container px-8 py-20">
        {/* Text Content */}
        <div className="max-w-2xl">
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-ink"></div>
              <span className="text-xs font-medium text-ink" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                Depuis 2003
              </span>
              <span className="text-xs italic text-terracotta" style={{ fontFamily: "'DM Serif Display', serif" }}>I</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 text-ink"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            L'art de la
            <br />
            <span className="text-terracotta italic">pizza</span> depuis
            <br />
            plus de 20 ans
          </motion.h1>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="border-t border-border mb-8 pt-6 flex flex-wrap gap-8 text-sm"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-ink font-medium">4,4</span>
              <span className="text-ink-soft">— 247 avis</span>
            </div>
            <div className="text-ink-soft">Pizzeria · Uccle</div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl text-ink-soft max-w-xl mb-10 leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: "300" }}
          >
            Pizzas artisanales cuites au feu de bois, dans un cadre chaleureux et authentique au coeur d'Uccle.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#reservation"
              className="px-8 py-4 bg-olive-deep text-cream text-xs font-medium transition-all duration-300 hover:bg-terracotta-deep"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              Réserver une table
            </a>
            <button
              className="px-8 py-4 border border-ink text-ink transition-all duration-300 hover:bg-ink hover:text-cream"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.22em", textTransform: "uppercase" }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Nous contacter
            </button>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 border border-terracotta flex items-center justify-center bg-cream z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="text-xs font-medium text-terracotta" style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}>Dal 2003</span>
          </div>
          <img
            src={HERO_IMG}
            alt="Pizza artisanale au feu de bois"
            className="w-full h-auto object-cover aspect-[4/5]"
            style={{
              filter: "saturate(0.95) contrast(1.05)",
            }}
          />
        </motion.div>
      </div>

      {/* Info Pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="flex flex-wrap gap-3 container px-8 pb-8"
      >
        {["Repas sur place", "Vente à emporter", "20–30 € / pers."].map((item) => (
          <span
            key={item}
            className="px-4 py-2 border border-border text-ink-soft text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
