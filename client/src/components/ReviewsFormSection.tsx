import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Star, Send, AlertCircle } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default function ReviewsFormSection() {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [step, setStep] = useState<"form" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createReview = trpc.reviews.create.useMutation();
  const { data: approvedReviews = [] } = trpc.reviews.getApproved.useQuery({
    limit: 6,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email invalide";
    if (formData.rating === 0) newErrors.rating = "Veuillez sélectionner une note";
    if (formData.comment.trim().length < 10)
      newErrors.comment = "Le commentaire doit contenir au moins 10 caractères";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createReview.mutateAsync({
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        comment: formData.comment,
      });

      toast.success("Merci ! Votre avis a été soumis et sera publié après modération.");
      setStep("success");
      setFormData({ name: "", email: "", rating: 0, comment: "" });

      setTimeout(() => {
        setStep("form");
      }, 4000);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Erreur lors de la soumission. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const averageRating =
    approvedReviews.length > 0
      ? (
          approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
          approvedReviews.length
        ).toFixed(1)
      : 0;

  return (
    <section id="reviews-form" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div ref={ref} className="container">
        {/* Header */}
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
            Vos Avis
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Partagez votre <span className="text-gold italic">expérience</span>
          </h2>
          <p
            className="text-cream/50 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Votre avis nous aide à nous améliorer. Laissez-nous un commentaire !
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl bg-card/60 border border-border/30 backdrop-blur-sm p-8 md:p-10"
          >
            {step === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-cream text-sm font-medium mb-2"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Votre nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Jean Dupont"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-cream text-sm font-medium mb-2"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Votre email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="jean@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-cream text-sm font-medium mb-3"
                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Votre note
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        disabled={isLoading}
                        className="transition-transform hover:scale-110 disabled:opacity-50"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || formData.rating)
                              ? "fill-gold text-gold"
                              : "text-cream/30"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && (
                    <p className="text-red-400 text-xs mt-2">{errors.rating}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-cream text-sm font-medium mb-2"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Votre commentaire
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    placeholder="Partagez votre expérience..."
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p
                      className="text-cream/40 text-xs"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {formData.comment.length}/1000
                    </p>
                    {errors.comment && (
                      <p className="text-red-400 text-xs">{errors.comment}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold text-background rounded-lg font-semibold hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? "Envoi..." : "Envoyer mon avis"}
                </button>

                <p
                  className="text-cream/40 text-xs text-center"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Votre avis sera publié après modération
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-gold fill-gold" />
                </div>
                <h3
                  className="text-2xl font-bold text-cream mb-2"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  Merci !
                </h3>
                <p
                  className="text-cream/60"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Votre avis a été reçu et sera publié après vérification.
                </p>
              </div>
            )}
          </motion.div>

          {/* Reviews Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="rounded-2xl bg-card/60 border border-border/30 backdrop-blur-sm p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(Number(averageRating))
                          ? "fill-gold text-gold"
                          : "text-cream/30"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className="text-3xl font-bold text-gold"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  {averageRating}
                </span>
              </div>
              <p
                className="text-cream/60 text-sm"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Basé sur {approvedReviews.length} avis
              </p>
            </div>

            {/* Recent Reviews */}
            <div className="space-y-4">
              {approvedReviews.length > 0 ? (
                approvedReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="rounded-xl bg-card/50 border border-border/20 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4
                          className="text-cream font-semibold"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {review.name}
                        </h4>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? "fill-gold text-gold"
                                  : "text-cream/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-cream/70 text-sm leading-relaxed"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {review.comment}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-xl bg-card/50 border border-border/20 p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-cream/40 mx-auto mb-2" />
                  <p
                    className="text-cream/60 text-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Aucun avis approuvé pour le moment. Soyez le premier !
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
