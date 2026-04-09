/*
 * La Pomme de Pin — "Notte Stellata" Design
 * Dark immersive theme, gold accents, scroll-driven animations
 * Cormorant headings, Outfit body text
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhyUsSection from "@/components/WhyUsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <WhyUsSection />
      <GallerySection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
