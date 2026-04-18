import { useState, useEffect } from "react";
import { Phone, Menu, X, CalendarDays } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Accueil", href: "#hero" },
    { label: "Notre Histoire", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Réservation", href: "#reservation" },
    { label: "Avis", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/30 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <span
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Il Divido
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-300 tracking-wide uppercase"
              style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "0.1em" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="#reservation"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gold text-background rounded-full text-sm font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <CalendarDays className="w-4 h-4" />
            Réserver
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-cream/80 hover:text-gold transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/30 transition-all duration-300 ${
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base text-cream/80 hover:text-gold transition-colors py-2 uppercase tracking-wider"
              style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reservation"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gold text-background rounded-full text-sm font-semibold mt-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
            onClick={() => setMobileOpen(false)}
          >
            <CalendarDays className="w-4 h-4" />
            Réserver une table
          </a>
        </div>
      </div>
    </nav>
  );
}
