import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MapPin, Phone, Clock, Globe, Navigation } from "lucide-react";
import { useState } from "react";
import { MapView } from "@/components/Map";

const contactInfo = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "Chp du Vert Chasseur 87, 1180 Uccle",
    href: "https://maps.google.com/?q=Il+Divido+Uccle",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "02 374 27 36",
    href: null,
  },
  {
    icon: Globe,
    label: "Site web",
    value: "Il Divido",
    href: null,
  },
  {
    icon: Clock,
    label: "Horaires",
    value: "Ouvert tous les soirs dès 19h00",
    href: null,
  },
];

const hours = [
  { day: "Lundi", time: "Fermé" },
  { day: "Mardi", time: "19:00 – 22:30" },
  { day: "Mercredi", time: "19:00 – 22:30" },
  { day: "Jeudi", time: "19:00 – 22:30" },
  { day: "Vendredi", time: "19:00 – 23:00" },
  { day: "Samedi", time: "19:00 – 23:00" },
  { day: "Dimanche", time: "19:00 – 22:30" },
];

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-secondary/30">
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
            Nous Trouver
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Venez nous <span className="text-gold italic">rendre visite</span>
          </h2>
          <p
            className="text-foreground text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Nous sommes situés au coeur d'Uccle, dans un cadre chaleureux qui vous attend chaque soir.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Map + Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#f7e7ce]/40 h-[300px] mb-8">
              <MapView
                onMapReady={(map) => {
                  const location = { lat: 50.8003, lng: 4.3467 };
                  map.setCenter(location);
                  map.setZoom(15);
                  new google.maps.Marker({
                    position: location,
                    map,
                    title: "La Pomme de Pin",
                  });
                }}
              />
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block p-4 rounded-xl bg-[#f7e7ce]/20 border border-border/20 hover:border-gold/30 transition-all duration-300 group h-full"
                    >
                      <item.icon className="w-5 h-5 text-gold mb-2 group-hover:scale-110 transition-transform" />
                      <p
                        className="text-foreground text-xs uppercase tracking-wider mb-1"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-foreground text-sm font-medium group-hover:text-gold transition-colors"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {item.value}
                      </p>
                    </a>
                  ) : (
                    <div className="block p-4 rounded-xl bg-[#f7e7ce]/20 border border-border/20 h-full">
                      <item.icon className="w-5 h-5 text-gold mb-2" />
                      <p
                        className="text-foreground text-xs uppercase tracking-wider mb-1"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-foreground text-sm font-medium"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 p-6 rounded-xl bg-[#f7e7ce]/20 border border-border/20"
            >
              <h4
                className="text-lg font-bold text-gold mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                <Clock className="w-5 h-5" />
                Horaires d'ouverture
              </h4>
              <div className="space-y-2">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between items-center py-1.5 border-b border-border/10 last:border-0"
                  >
                    <span
                      className="text-foreground text-sm"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {h.day}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        h.time === "Fermé" ? "text-foreground" : "text-foreground"
                      }`}
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="p-8 rounded-2xl bg-[#f7e7ce]/20 border border-border/20">
              <h3
                className="text-3xl font-bold text-foreground mb-2"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Contactez-nous
              </h3>
              <p
                className="text-foreground text-sm mb-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Envoyez-nous un message et nous vous répondrons rapidement.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    className="text-foreground text-sm mb-2 block"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f7e7ce]/30 border border-[#f7e7ce]/40 text-foreground placeholder:text-foreground/20 focus:border-gold/50 focus:outline-none transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-foreground text-sm mb-2 block"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f7e7ce]/30 border border-[#f7e7ce]/40 text-foreground placeholder:text-foreground/20 focus:border-gold/50 focus:outline-none transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                    placeholder="Votre numéro"
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-foreground text-sm mb-2 block"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[#f7e7ce]/30 border border-[#f7e7ce]/40 text-foreground placeholder:text-foreground/20 focus:border-gold/50 focus:outline-none transition-colors resize-none"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                    placeholder="Votre message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gold text-background rounded-xl text-base font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {submitted ? "Message envoyé !" : "Envoyer le message"}
                </button>
              </form>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-border/20">
                <p
                  className="text-foreground text-sm mb-4"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Ou contactez-nous directement :
                </p>
                <div className="flex gap-3">
                  <a
                    href="tel:023742736"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gold/30 text-gold text-sm font-medium hover:bg-gold/10 transition-all duration-300"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                  <a
                    href="https://maps.google.com/?q=La+Pomme+de+Pin+Uccle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gold/30 text-gold text-sm font-medium hover:bg-gold/10 transition-all duration-300"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <Navigation className="w-4 h-4" />
                    Itinéraire
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
