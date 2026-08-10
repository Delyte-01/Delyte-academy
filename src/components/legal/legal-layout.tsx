"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Link as LinkIcon, Menu, X } from "lucide-react";
import type { LegalDoc } from "./legal-data";

interface LegalLayoutProps {
  doc: LegalDoc;
}

export function LegalLayout({ doc }: LegalLayoutProps) {
  const [activeId, setActiveId] = useState<string>(doc.sections[0]?.id ?? "");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sectionIds = useMemo(
    () => doc.sections.map((s) => s.id),
    [doc.sections],
  );

  // Scroll-spy: highlight whichever clause is currently in view.
  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCopyAnchor = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedId(id);
    window.setTimeout(
      () => setCopiedId((cur) => (cur === id ? null : cur)),
      1600,
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFAF9] text-[#1B1C19]">
      {/* ─── Top bar ─── */}
      <div className="sticky top-0 z-30 border-b border-[#E7E4DC]/80 bg-[#FBFAF9]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="https://res.cloudinary.com/dk5mfu099/image/upload/v1784147337/Group_1_bpvzwx.svg"
              alt="Delyte Academy logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="text-sm font-semibold tracking-tight text-[#1B1C19]">
              Delyte Academy
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E4DC] px-3 py-1.5 text-xs font-medium text-[#6B6D64] transition-colors hover:border-[#0E5A3B]/40 hover:text-[#0E5A3B] lg:hidden"
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Menu className="h-3.5 w-3.5" />
            )}
            Contents
          </button>
        </div>

        {/* Mobile TOC */}
        {mobileNavOpen && (
          <nav className="border-t border-[#E7E4DC] bg-[#FBFAF9] px-6 py-4 lg:hidden">
            <TableOfContents
              doc={doc}
              activeId={activeId}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </nav>
        )}
      </div>

      {/* ─── Hero ─── */}
      <header className="border-b border-[#E7E4DC]">
        <div className="mx-auto max-w-[1100px] px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-[#E7E4DC] bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6B6D64]">
              Legal
            </span>
            <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[#1B1C19] sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#6B6D64]">
              {doc.intro}
            </p>
            <p className="mt-6 font-mono text-xs text-[#6B6D64]">
              Last updated&nbsp;
              <span className="font-semibold text-[#1B1C19]">
                {doc.lastUpdated}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ─── Body: sticky TOC + content ─── */}
      <main className="mx-auto max-w-[1100px] px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6B6D64]">
                On this page
              </p>
              <TableOfContents doc={doc} activeId={activeId} />
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 space-y-14">
            {doc.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
                <div className="group flex items-baseline gap-3">
                  <span className="select-none font-mono text-sm text-[#0E5A3B]/70">
                    §{section.number.toString().padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-xl font-semibold tracking-tight text-[#1B1C19] sm:text-2xl">
                    {section.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleCopyAnchor(section.id)}
                    className="ml-1 hidden shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-[#6B6D64] opacity-0 transition-opacity hover:text-[#0E5A3B] group-hover:opacity-100 lg:inline-flex"
                    aria-label={`Copy link to ${section.title}`}
                  >
                    <LinkIcon className="h-3 w-3" />
                    {copiedId === section.id ? "Copied" : "Link"}
                  </button>
                </div>

                <div className="mt-4 space-y-4 border-l border-[#E7E4DC] pl-5">
                  {section.paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-[1.75] text-[#4B4C46]"
                    >
                      {para}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="space-y-2.5">
                      {section.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-[15px] leading-[1.75] text-[#4B4C46]"
                        >
                          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0E5A3B]" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#E7E4DC] bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <p className="text-sm leading-relaxed text-[#6B6D64]">
            Questions about these policies? Write to us at{" "}
            <a
              href="mailto:support@delyteacademy.com"
              className="font-semibold text-[#0E5A3B] hover:underline"
            >
              support@delyteacademy.com
            </a>
            .
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/privacy-policy"
              className="text-[#6B6D64] transition-colors hover:text-[#1B1C19]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-[#6B6D64] transition-colors hover:text-[#1B1C19]"
            >
              Terms of Service
            </Link>
            <a
              href="mailto:support@delyteacademy.com"
              className="text-[#6B6D64] transition-colors hover:text-[#1B1C19]"
            >
              Contact
            </a>
          </div>

          <p className="mt-6 font-mono text-xs text-[#6B6D64]">
            © {new Date().getFullYear()} Delyte Academy. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ─── Back to top ─── */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E4DC] bg-white text-[#1B1C19] shadow-sm transition-all duration-200 hover:border-[#0E5A3B]/40 hover:text-[#0E5A3B] ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}

function TableOfContents({
  doc,
  activeId,
  onNavigate,
}: {
  doc: LegalDoc;
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <ol className="space-y-1 border-l border-[#E7E4DC]">
      {doc.sections.map((section) => {
        const isActive = section.id === activeId;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={onNavigate}
              className={`-ml-px flex items-start gap-2 border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                isActive
                  ? "border-[#0E5A3B] font-medium text-[#0E5A3B]"
                  : "border-transparent text-[#6B6D64] hover:border-[#E7E4DC] hover:text-[#1B1C19]"
              }`}
            >
              <span className="font-mono text-xs tabular-nums text-[#9A9C90]">
                {section.number.toString().padStart(2, "0")}
              </span>
              <span className="leading-snug">{section.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
