import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal, RevealText } from "@/components/motion";

export interface AuthPanelItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

interface AuthShellProps {
  title: string;
  /** Line under the title, usually a link to the sibling auth page. */
  subtitle: React.ReactNode;
  children: React.ReactNode;
  /** Right-hand brand panel (desktop only). */
  panelHeading: string;
  panelText: string;
  panelItems?: AuthPanelItem[];
  /** Photo shown full-bleed in the right-hand panel. */
  image: { src: string; alt: string };
}

/**
 * Shared layout for /login and /sign-up: a focused form column and a static
 * photo panel (stock image under a dark brand overlay, with the real benefits
 * laid over it; no fake product data).
 */
export function AuthShell({
  title,
  subtitle,
  children,
  panelHeading,
  panelText,
  panelItems,
  image,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full flex-col px-6 py-6 sm:px-10 lg:w-[46%] lg:px-14 xl:px-20">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Delyte Academy home"
            className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <Logo priority />
          </Link>
          <ThemeToggle />
        </div>

        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <Reveal on="mount" selector="[data-auth-reveal]" stagger={0.06} y={14}>
            <h1
              data-auth-reveal
              className="font-heading text-[2rem] font-extrabold leading-tight tracking-tight text-foreground"
            >
              {title}
            </h1>
            <p data-auth-reveal className="mt-2 text-[15px] text-muted-foreground">
              {subtitle}
            </p>
            <div data-auth-reveal className="mt-8">
              {children}
            </div>
          </Reveal>
        </main>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 self-center rounded text-sm font-semibold text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40 lg:self-start"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to home
        </Link>
      </div>

      <aside className="relative isolate hidden overflow-hidden border-l bg-ink lg:flex lg:w-[54%] lg:flex-col lg:justify-end lg:px-12 lg:pb-20 lg:pt-16 xl:px-20 xl:pb-24">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="54vw"
          className="-z-20 object-cover"
        />
        {/* readability overlay: dark at the bottom where the text sits, brand tint on top */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--ink)_94%,transparent)_8%,color-mix(in_oklab,var(--ink)_62%,transparent)_48%,color-mix(in_oklab,var(--ink)_18%,transparent)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-brand-gradient opacity-20 mix-blend-multiply"
        />

        <div className="max-w-lg">
          <RevealText
            as="h2"
            text={panelHeading}
            delay={0.15}
            className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-foreground xl:text-[2.75rem]"
          />
          <Reveal on="mount" delay={0.5} y={12}>
            <p className="mt-4 text-lg leading-relaxed text-ink-foreground/85">
              {panelText}
            </p>
          </Reveal>

          {panelItems && panelItems.length > 0 && (
            <Reveal
              as="ul"
              on="mount"
              delay={0.65}
              selector="[data-panel-item]"
              stagger={0.09}
              y={14}
              className="mt-8 flex flex-wrap gap-2.5"
            >
              {panelItems.map(({ icon: Icon, title: itemTitle }) => (
                <li
                  key={itemTitle}
                  data-panel-item
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-ink/45 py-2 pl-2.5 pr-4 text-sm font-semibold text-ink-foreground backdrop-blur-md"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {itemTitle}
                </li>
              ))}
            </Reveal>
          )}
        </div>

        <p className="absolute bottom-7 left-12 text-xs text-ink-foreground/70 xl:left-20">
          © {new Date().getFullYear()} Delyte Academy. All rights reserved.
        </p>
      </aside>
    </div>
  );
}
