import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Star, ChevronDown, CalendarDays } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/hero-pizza-VfREaST9G2JTFrxvuYtYgW.webp";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Pizza artisanale au feu de bois"
          className="w-full h-full object-cover scale-110"
          style={{
            filter: "brightness(0.35) saturate(1.1)",
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center container">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-gold text-sm font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
                4,4
              </span>
              <span className="text-cream/50 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                — 247 avis
              </span>
            </div>
            <span className="text-cream/40 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Pizzeria · Uccle
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 text-cream"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            L'art de la
            <br />
            <span className="text-gold italic">pizza</span> depuis
            <br />
            plus de 20 ans
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-cream/60 max-w-xl mb-10 leading-relaxed"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Pizzas artisanales cuites au feu de bois, dans un cadre chaleureux et authentique au coeur d'Uccle.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#reservation"
              className="group flex items-center gap-3 px-8 py-4 bg-gold text-background rounded-full text-base font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <CalendarDays className="w-5 h-5 group-hover:animate-pulse" />
              Réserver une table
            </a>
            <a
              href="tel:023742736"
              className="flex items-center gap-3 px-8 py-4 border border-cream/20 text-cream rounded-full text-base font-medium hover:border-gold/50 hover:text-gold transition-all duration-300"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Phone className="w-5 h-5" />
              Appeler
            </a>
          </motion.div>

          {/* Info Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {["Repas sur place", "Vente à emporter", "20–30 € / pers."].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cream/50 text-sm"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-cream/30 text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Découvrir
        </span>
        <ChevronDown className="w-5 h-5 text-gold/50 animate-bounce" />
      </motion.div>
    </section>
  );
}
