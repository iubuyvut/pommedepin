import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Flame, Heart, Clock, Award } from "lucide-react";

const features = [
  {
    icon: Flame,
    title: "Four Traditionnel",
    description: "Nos pizzas sont cuites dans un four à bois traditionnel, pour une croûte parfaitement dorée et un goût incomparable.",
  },
  {
    icon: Heart,
    title: "Accueil Chaleureux",
    description: "Nos patrons sont toujours adorables et contribuent au plaisir de chaque visite. Un restaurant comme on en fait de moins en moins.",
  },
  {
    icon: Clock,
    title: "20+ Ans d'Excellence",
    description: "Depuis plus de deux décennies, nous perpétuons la tradition de la pizza artisanale avec la même passion qu'au premier jour.",
  },
  {
    icon: Award,
    title: "Ingrédients Premium",
    description: "Chaque ingrédient est soigneusement sélectionné pour garantir une qualité exceptionnelle et des saveurs authentiques.",
  },
];

export default function WhyUsSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(201,169,110,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(201,169,110,0.2) 0%, transparent 50%)",
          }}
        />
      </div>

      <div ref={ref} className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span
            className="text-accent text-sm uppercase tracking-[0.2em] mb-4 block"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Pourquoi Nous Choisir
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Une adresse <span className="text-accent italic">à garder</span>
          </h2>
          <p
            className="text-foreground/50 text-lg"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Ce qui fait de La Pomme de Pin une expérience unique à Uccle.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
              className="group relative p-8 rounded-2xl bg-card/50 border border-border/20 hover:border-primary/30 transition-all duration-500 hover:bg-card/80"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>

              <h3
                className="text-2xl font-bold text-foreground mb-3"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-foreground/50 leading-relaxed"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button
            className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-background rounded-full text-base font-semibold hover:bg-primary-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
            onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Réservez votre table
          </button>
          <p
            className="text-foreground/30 text-sm mt-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Ouvert tous les soirs à partir de 19h00
          </p>
        </motion.div>
      </div>
    </section>
  );
}
