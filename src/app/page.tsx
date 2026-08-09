"use client";
import DelyteLoader from "@/components/delyte-loader";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import { CoursesSection } from "@/features/courses-section";
import { FAQ } from "@/features/FAQ";
import { Hero } from "@/features/hero-section";
import { FeaturesSection } from "@/features/learning-feature";
import { StatsStrip } from "@/features/stats-section";
import { Testimonials } from "@/features/testimonials";

import { useState } from "react";

export default function Home() {
const [loading, setLoading] = useState(true);
  return (
    <>
  
      {loading && <DelyteLoader onComplete={() => setLoading(false)} />}
      <main className="overflow-x-hidden">
        <Navbar />
        <Hero />
        <StatsStrip />
        <CoursesSection  />
        <FeaturesSection />
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
