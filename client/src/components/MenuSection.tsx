import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ExternalLink } from "lucide-react";

const PIZZA_WHITE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/a1623feSS4YD_9c738d4f.jpg";
const PIZZA_TROPICALE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/4dj5ElxwSRKq_75940e51.jpg";
const CHOCOLATE_MOUSSE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/h3yMwDqqdyDi_a46db364.jpg";

const dishes = [
  {
    name: "Pizza Blanche",
    description: "Ricotta, mozzarella, huile de truffe, roquette fraîche",
    image: PIZZA_WHITE,
    tag: "Signature",
  },
  {
    name: "Pizza Tropicale",
    description: "Jambon, ananas grillé, mozzarella, basilic frais",
    image: PIZZA_TROPICALE,
    tag: "Populaire",
  },
  {
    name: "Mousse au Chocolat",
    description: "Chocolat noir belge, éclat de feuille d'or, cacao",
    image: CHOCOLATE_MOUSSE,
    tag: "Dessert",
  },
];

const menuCategories = [
  { name: "Pizzas Classiques", items: ["Margherita", "Quattro Formaggi", "Diavola", "Calzone"] },
  { name: "Pizzas Spéciales", items: ["Provençale", "Christorphe", "Blanche", "Tropicale"] },
  { name: "Entrées & Salades", items: ["Salade d'Avocat", "Bruschetta", "Antipasti", "Carpaccio"] },
  { name: "Desserts", items: ["Mousse au Chocolat", "Tiramisu", "Panna Cotta", "Gelato"] },
];

export default function MenuSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="menu" className="relative py-24 md:py-32 bg-secondary/30">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div ref={ref} className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span
            className="text-gold text-sm uppercase tracking-[0.2em] mb-4 block"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Nos Créations
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Menu & <span className="text-gold italic">Plats Populaires</span>
          </h2>
          <p
            className="text-foreground text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Découvrez nos pizzas artisanales, préparées avec passion et des ingrédients de première qualité.
          </p>
        </motion.div>

        {/* Featured Dishes */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {dishes.map((dish, i) => (
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-[#f7e7ce]/40 hover:border-gold/30 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-medium"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {dish.tag}
                </span>
              </div>
              <div className="p-6">
                <h3
                  className="text-2xl font-bold text-foreground mb-2"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  {dish.name}
                </h3>
                <p
                  className="text-foreground text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {dish.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Menu Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                className="group"
              >
                <h4
                  className="text-xl font-bold text-gold mb-4 pb-3 border-b border-gold/20"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  {cat.name}
                </h4>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="text-foreground text-sm flex items-center gap-2 hover:text-foreground transition-colors"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      <span className="w-1 h-1 rounded-full bg-gold/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-14"
        >
          <a
            href="https://pommedepin.be"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold/40 text-gold rounded-full text-sm font-medium hover:bg-gold/10 transition-all duration-300"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Voir le menu complet
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
