import { Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-border/20">
      {/* Decorative gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gold/40" />

      <div className="container">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="text-3xl font-bold text-gold mb-4"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              La Pomme de Pin
            </h3>
            <p
              className="text-cream/40 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Pizzeria artisanale à Uccle depuis plus de 20 ans. L'art de la pizza dans un cadre chaleureux et authentique.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-lg font-bold text-cream mb-4"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Navigation
            </h4>
            <div className="space-y-3">
              {[
                { label: "Accueil", href: "#hero" },
                { label: "Notre Histoire", href: "#about" },
                { label: "Menu", href: "#menu" },
                { label: "Avis", href: "#reviews" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-cream/40 text-sm hover:text-gold transition-colors"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-lg font-bold text-cream mb-4"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="tel:023742736"
                className="flex items-center gap-2 text-cream/40 text-sm hover:text-gold transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <Phone className="w-4 h-4" />
                02 374 27 36
              </a>
              <a
                href="https://maps.google.com/?q=La+Pomme+de+Pin+Uccle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream/40 text-sm hover:text-gold transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <MapPin className="w-4 h-4" />
                Chp du Vert Chasseur 87, 1180 Uccle
              </a>
              <a
                href="https://pommedepin.be"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream/40 text-sm hover:text-gold transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <Globe className="w-4 h-4" />
                pommedepin.be
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-cream/20 text-xs"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            &copy; {new Date().getFullYear()} La Pomme de Pin. Tous droits réservés.
          </p>
          <p
            className="text-cream/20 text-xs"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Pizzeria · Uccle · Bruxelles
          </p>
        </div>
      </div>
    </footer>
  );
}
