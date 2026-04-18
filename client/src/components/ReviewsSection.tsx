import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Arnaud",
    badge: "Local Guide · 19 avis",
    rating: 5,
    date: "il y a 2 mois",
    text: "Je viens ici depuis au moins 20 ans, et ce sont pour moi parmi les meilleures pizza, en particulier la blanche ! Un resto comme on en fait de moins en moins et c'est bien dommage. Les patrons sont toujours adorables et contribuent au plaisir de venir, bref une adresse à garder !",
    initial: "A",
  },
  {
    name: "K",
    badge: "Local Guide · 43 avis",
    rating: 5,
    date: "il y a un an",
    text: "Magnifique découverte. Une jolie parenthèse enchantée. J'ai tout aimé, la décoration, le mobilier, la musique diffusée, l'accueil, le service... Le repas était délicieux, on a tous été agréablement surpris autant par le plat que par les desserts.",
    initial: "K",
  },
  {
    name: "Sophie M.",
    badge: "12 avis",
    rating: 5,
    date: "il y a 3 mois",
    text: "La provençale est tout simplement divine ! Le cadre est magnifique et les prix sont très raisonnables pour la qualité proposée. On reviendra sans hésiter.",
    initial: "S",
  },
  {
    name: "Marc D.",
    badge: "Local Guide · 28 avis",
    rating: 4,
    date: "il y a 4 mois",
    text: "Excellent rapport qualité-prix. La patronne est d'une gentillesse rare. Les pizzas sont généreuses et savoureuses. Le cadre est chaleureux et authentique. Une vraie pépite à Uccle.",
    initial: "M",
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 68 },
  { stars: 4, percentage: 20 },
  { stars: 3, percentage: 7 },
  { stars: 2, percentage: 3 },
  { stars: 1, percentage: 2 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-gold fill-gold" : "text-cream/20"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="reviews" className="relative py-24 md:py-32">
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
            Témoignages
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Ce que disent <span className="text-gold italic">nos clients</span>
          </h2>
        </motion.div>

        {/* Rating Summary + Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16 p-8 rounded-2xl bg-card/50 border border-border/20 max-w-3xl mx-auto"
        >
          {/* Big Rating */}
          <div className="text-center">
            <div
              className="text-7xl font-bold text-gold"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              4,4
            </div>
            <div className="flex justify-center mt-2 mb-1">
              <StarRating rating={4} />
            </div>
            <p
              className="text-cream/40 text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              247 avis Google
            </p>
          </div>

          {/* Distribution Bars */}
          <div className="flex-1 w-full max-w-xs space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span
                  className="text-cream/50 text-sm w-3 text-right"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {item.stars}
                </span>
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isVisible ? { width: `${item.percentage}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 + (5 - item.stars) * 0.1 }}
                    className="h-full rounded-full bg-gold"
                  />
                </div>
                <span
                  className="text-cream/40 text-xs w-8"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
              className="group p-6 rounded-2xl bg-card/40 border border-border/20 hover:border-gold/20 transition-all duration-500 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-gold/10 group-hover:text-gold/20 transition-colors" />

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                  <span
                    className="text-gold font-bold text-lg"
                    style={{ fontFamily: "'Cormorant', serif" }}
                  >
                    {review.initial}
                  </span>
                </div>
                <div>
                  <h4
                    className="text-cream font-semibold text-base"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {review.name}
                  </h4>
                  <p
                    className="text-cream/40 text-xs"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {review.badge}
                  </p>
                </div>
              </div>

              {/* Rating + Date */}
              <div className="flex items-center gap-3 mb-3">
                <StarRating rating={review.rating} />
                <span
                  className="text-cream/30 text-xs"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {review.date}
                </span>
              </div>

              {/* Text */}
              <p
                className="text-cream/60 text-sm leading-relaxed"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {[
            { label: "provençale", count: 13 },
            { label: "prix", count: 6 },
            { label: "patronne", count: 5 },
            { label: "cadre", count: 5 },
            { label: "blanche", count: 4 },
            { label: "desserts", count: 3 },
          ].map((tag) => (
            <span
              key={tag.label}
              className="px-4 py-2 rounded-full bg-card/50 border border-border/20 text-cream/50 text-sm hover:border-gold/30 hover:text-gold transition-all duration-300"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {tag.label} <span className="text-cream/30">{tag.count}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
