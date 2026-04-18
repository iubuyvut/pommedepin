import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HERO_PIZZA = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/4dj5ElxwSRKq_75940e51.jpg";
const RESTAURANT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/V6y3OPad3ouj_ef7964c0.jpg";
const PIZZA_WHITE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/a1623feSS4YD_9c738d4f.jpg";
const PIZZA_TROPICALE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/h3yMwDqqdyDi_a46db364.jpg";
const CHOCOLATE_MOUSSE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366896650/PM6jjmsoS5EWWWLtQBTqh8/YrmeaP3QPEGS_eef8316d.jpg";

const photos = [
  { src: HERO_PIZZA, alt: "Pizza Margherita artisanale", span: "md:col-span-2 md:row-span-2" },
  { src: RESTAURANT, alt: "Intérieur du restaurant", span: "" },
  { src: PIZZA_WHITE, alt: "Pizza Blanche signature", span: "" },
  { src: PIZZA_TROPICALE, alt: "Pizza Tropicale", span: "md:col-span-2" },
  { src: CHOCOLATE_MOUSSE, alt: "Mousse au chocolat", span: "" },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <section className="relative py-24 md:py-32 bg-secondary/20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

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
            Galerie
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Photos & <span className="text-gold italic">Atmosphère</span>
          </h2>
        </motion.div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.alt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className={`group relative overflow-hidden rounded-xl ${photo.span} ${
                i === 0 ? "h-64 md:h-full" : "h-48 md:h-64"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-[#f7e7ce]/30 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p
                  className="text-foreground text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {photo.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
