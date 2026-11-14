import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";

const PRODUCT_LINKS: [string, string][] = [
  ["/#features", "Features"],
  ["/#how-it-works", "How it works"],
  ["/#courses", "Courses"],
  ["/#faq", "FAQ"],
];

const ACCOUNT_LINKS: [string, string][] = [
  ["/login", "Sign in"],
  ["/sign-up", "Create account"],
  ["/dashboard", "Dashboard"],
];

const LEGAL_LINKS: [string, string][] = [
  ["/privacy-policy", "Privacy policy"],
  ["/terms-of-service", "Terms of service"],
];

const linkClass =
  "rounded text-[15px] font-medium text-ink-muted outline-none transition-colors hover:text-ink-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60";

function LinkColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-[15px] font-bold text-ink-foreground">{title}</h2>
      <ul className="mt-5 space-y-3.5">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className={linkClass}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Site footer. Server component. Sits on the permanently dark "ink" surface in
 * both themes, so it uses the on-dark logo artwork and ink tokens.
 */
export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pb-10 lg:px-8 lg:pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Delyte Academy home"
              className="inline-block rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
            >
              <Logo tone="onDark" />
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">
              A web-based learning platform for structured courses, CBT-style
              quizzes and progress tracking.
            </p>

            <ul className="mt-8 space-y-3.5 text-[15px] text-ink-muted">
              <li>
                <a
                  href="tel:+2348139760048"
                  className="inline-flex items-center gap-3 rounded transition-colors hover:text-ink-foreground"
                >
                  <Phone className="size-4 text-ink-foreground/70" aria-hidden />
                  +234 8139760048
                </a>
              </li>
              <li>
                <a
                  href="mailto:delyte780@gmail.com"
                  className="inline-flex items-center gap-3 rounded transition-colors hover:text-ink-foreground"
                >
                  <Mail className="size-4 text-ink-foreground/70" aria-hidden />
                  delyte780@gmail.com
                </a>
              </li>
              <li className="inline-flex items-center gap-3">
                <MapPin className="size-4 text-ink-foreground/70" aria-hidden />
                Lagos, Nigeria (Remote-first)
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:justify-items-end">
            <LinkColumn title="Product" links={PRODUCT_LINKS} />
            <LinkColumn title="Account" links={ACCOUNT_LINKS} />
            <LinkColumn title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:mt-16 items-center justify-between gap-3 border-t border-ink-line pt-6 text-sm text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Delyte Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
