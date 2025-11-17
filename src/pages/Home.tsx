import { Navigation } from "@/components/layout/navigation";
import Hero from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";
import TimelineSteps from "@/components/landing/TimelineSteps";
import FeatureGrid from "@/components/landing/FeatureGrid";
import Testimonial from "@/components/landing/Testimonial";
import FinalCTA from "@/components/landing/FinalCTA";
import FooterMinimal from "@/components/landing/FooterMinimal";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, userName, signOut } = useAuthContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={signOut}
      />
      <Hero />
      <FeatureSection />
      <TimelineSteps />
      <FeatureGrid />
      <Testimonial />
      <FinalCTA />
      <FooterMinimal />
    </div>
  );
}