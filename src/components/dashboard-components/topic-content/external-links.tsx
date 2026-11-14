"use client";

import { ExternalLink } from "lucide-react";

type TopicExternalLink = { title: string; url: string };

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ExternalLinksSection({
  links,
}: {
  links: TopicExternalLink[];
}) {
  if (!links || links.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Further reading</h2>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-success/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {link.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {getHostname(link.url)}
                </span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-success" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
