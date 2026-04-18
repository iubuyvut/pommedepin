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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-sm border-b border-border"
          : "bg-cream/80 backdrop-blur-sm border-b border-border"
      }`}
    >
      <div className="container flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span>
          <span
            className="text-2xl md:text-3xl font-light tracking-tight text-ink italic"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Il Divido
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-ink hover:text-terracotta transition-colors duration-300"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="#reservation"
            className="hidden sm:block px-6 py-3 bg-olive-deep text-cream text-xs font-medium transition-all duration-300 hover:bg-terracotta-deep"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            Réserver
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-ink hover:text-terracotta transition-colors"
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
