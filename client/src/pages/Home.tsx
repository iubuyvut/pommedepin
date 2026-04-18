/*
 * La Pomme de Pin — "Notte Stellata" Design
 * Dark immersive theme, gold accents, scroll-driven animations
 * Cormorant headings, Outfit body text
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import ReservationSection from "@/components/ReservationSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhyUsSection from "@/components/WhyUsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import GradientDivider from "@/components/GradientDivider";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <GradientDivider height={30} />
      <AboutSection />
      <GradientDivider height={30} />
      <MenuSection />
      <GradientDivider height={30} />
      <ReservationSection />
      <GradientDivider height={30} />
      <WhyUsSection />
      <GradientDivider height={30} />
      <GallerySection />
      <GradientDivider height={30} />
      <ReviewsSection />
      <GradientDivider height={30} />
      <ContactSection />
      <GradientDivider height={30} />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
