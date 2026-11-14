import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { BackToTop } from "@/components/back-to-top";

import { CtaBand } from "@/features/cta-band";
import { CoursesSection } from "@/features/courses-section";
import { FAQ } from "@/features/FAQ";
import { FeaturesSection } from "@/features/features-section";
import { Hero } from "@/features/hero-section";
import { HowItWorks } from "@/features/how-it-works";
import { StudySection } from "@/features/study-section";

export default function Home() {
  return (
    <div className="landing bg-background text-foreground">
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <FeaturesSection />
        <StudySection />
        <HowItWorks />
        <CoursesSection />
        <FAQ />
        <CtaBand />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
