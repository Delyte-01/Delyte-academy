"use client";

import { ExternalLink, LinkIcon, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the TopicExternalLink type locally to fix missing type error.
type TopicExternalLink = {
  title: string;
  url: string;
};

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
  const handleOpen = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!links || links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-8 text-center sm:p-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No external links available
        </p>
      </div>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <LinkIcon className="h-4 w-4" />
          </span>
          Useful Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {links.map((link, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => handleOpen(link.url)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleOpen(link.url);
            }}
            className="group flex cursor-pointer flex-col gap-3 rounded-xl border border-border/60 p-3.5 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/[0.04] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
          >
            <div className="flex items-start gap-3 sm:contents">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-transform duration-200 group-hover:scale-105">
                <ExternalLink className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {link.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {getHostname(link.url)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex-shrink-0 transition-colors group-hover:border-blue-500/50 group-hover:bg-blue-500/10 group-hover:text-blue-700 sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(link.url);
              }}
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Open
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
