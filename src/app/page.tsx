"use client";
import DelyteLoader from "@/components/delyte-loader";
import NeuralLoader from "@/components/delyte-loader";
import PrismLoader from "@/components/delyte-loader";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import { CoursesSection } from "@/features/courses-section";
import { FAQ } from "@/features/FAQ";
import { Hero } from "@/features/hero-section";
import { FeaturesSection } from "@/features/learning-feature";
import { StatsStrip } from "@/features/stats-section";
import { Testimonials } from "@/features/testimonials";
import { courses } from "@/lib/courseData";
import { useState } from "react";

export default function Home() {
const [loading, setLoading] = useState(true);
  return (
    <>
      {/* {!loaderDone && (
        <NeuralLoader onComplete={() => setLoaderDone(true)} speed={0.55} />
      )} */}
      {loading && <DelyteLoader onComplete={() => setLoading(false)} />}
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
    </>
  );
}
