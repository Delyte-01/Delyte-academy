"use client";

import { LegalLayout } from "@/components/legal/legal-layout";
import { privacyPolicy } from "@/components/legal/legal-data";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      doc={privacyPolicy}
      // otherPage={{ href: "/terms-of-service", label: "Terms of Service" }}
    />
  );
}
