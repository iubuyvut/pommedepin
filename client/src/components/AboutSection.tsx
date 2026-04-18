import { motion } from "framer-motion";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";

const RESTAURANT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/restaurant-ambiance-YDHxzgCYSE3u4zVnbYpryW.webp";

const stats = [
  { value: 20, suffix: "+", label: "Années d'expérience" },
  { value: 247, suffix: "", label: "Avis clients" },
  { value: 4, suffix: ",4", label: "Note Google", isDecimal: true },
];

function StatItem({ value, suffix, label, isDecimal }: { value: number; suffix: string; label: string; isDecimal?: boolean }) {
  const { ref, count } = useCountUp(value, 2000);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gold" style={{ fontFamily: "'Cormorant', serif" }}>
        {isDecimal ? `${count}${suffix}` : `${count}${suffix}`}
      </div>
      <div className="text-sm text-foreground mt-2 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {label}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

  return (
    <section id="about" className="relative py-24 md:py-32">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

      <div ref={sectionRef} className="container">
        {/* Large text reveal — inspired by jeskojets.com */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <p
            className="text-3xl md:text-4xl lg:text-5xl leading-snug font-light text-foreground"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            <motion.span
              initial={{ opacity: 0.15 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              Le Il Divido est une pizzeria artisanale
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0.15 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="text-gold"
            >
              nichée au coeur d'Uccle
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0.15 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              depuis plus de deux décennies. Nos patrons passionnés vous accueillent dans un cadre
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0.15 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 1.1 }}
              className="text-gold italic"
            >
              chaleureux et authentique.
            </motion.span>
          </p>
        </motion.div>

        {/* Image + Stats Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={RESTAURANT_IMG}
                alt="Intérieur chaleureux de La Pomme de Pin"
                className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/30 rounded-br-2xl" />
          </motion.div>

          {/* Text + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span
              className="text-gold text-sm uppercase tracking-[0.2em] mb-4 block"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Notre Histoire
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Une tradition
              <br />
              <span className="text-gold italic">de passion</span>
            </h2>
            <p
              className="text-foreground text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Depuis plus de 20 ans, Le Il Divido perpétue l'art de la pizza artisanale à Uccle.
              Chaque pizza est préparée avec des ingrédients soigneusement sélectionnés et cuite
              dans notre four traditionnel, pour un résultat qui ravit les papilles de nos fidèles clients.
              Nos patrons, toujours adorables, contribuent au plaisir de chaque visite.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#e8e0d5]/40">
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
