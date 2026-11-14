import type { Metadata } from "next";
import { Bricolage_Grotesque, Urbanist } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

import "katex/dist/katex.min.css";
import { AppProviders } from "@/providers/authProvider";

// One family for the whole product (headings + body). Variable font: 100–900.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

// Display face for landing headlines only; body and product UI stay on Urbanist.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Delyte Academy",
  description:
    "Practice your courses, take CBT tests, and track your progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AppProviders>
            <SmoothScrollProvider>
              {children}
              <Toaster richColors position="top-right" />
            </SmoothScrollProvider>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
