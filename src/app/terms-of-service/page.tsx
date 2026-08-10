"use client";

import { LegalLayout } from "@/components/legal/legal-layout";
import { termsOfService } from "@/components/legal/legal-data";

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      doc={termsOfService}
      // otherPage={{ href: "/privacy-policy", label: "Privacy Policy" }}
    />
  );
}
