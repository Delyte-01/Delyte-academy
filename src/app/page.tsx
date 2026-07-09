import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import { CoursesSection } from "@/features/courses-section";
import { FAQ } from "@/features/FAQ";
import { Hero } from "@/features/hero-section";
import { FeaturesSection } from "@/features/learning-feature";
import { StatsStrip } from "@/features/stats-section";
import { Testimonials } from "@/features/testimonials";
import { courses } from "@/lib/courseData";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsStrip />
      <CoursesSection courses={courses} />
      <FeaturesSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
