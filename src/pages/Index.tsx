import { useState, useCallback } from "react";
import IntroAnimation from "@/components/IntroAnimation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RulesSection from "@/components/RulesSection";
import JobsSection from "@/components/JobsSection";
import StaffSection from "@/components/StaffSection";
import GangsSection from "@/components/GangsSection";
import TopGangsSection from "@/components/TopGangsSection";
import GallerySection from "@/components/GallerySection";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      <IntroAnimation onComplete={handleIntroComplete} />
      {introComplete && (
        <>
          <AnnouncementBanner />
          <Navbar />
          <main className="snap-container">
            <HeroSection />
            <AboutSection />
            <RulesSection />
            <JobsSection />
            <TopGangsSection />
            <GangsSection />
            <GallerySection />
            <StaffSection />
            <FAQSection />
            <FooterSection />
          </main>
        </>
      )}
    </>
  );
};

export default Index;
