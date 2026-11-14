"use client";

function getEmbedUrl(raw?: string | null) {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}?rel=0`;
    }
    if (host.endsWith("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return raw;
      const shorts = url.pathname.match(/^\/shorts\/([^/]+)/);
      const id = shorts?.[1] ?? url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return raw;
  } catch {
    return raw;
  }
}

export function VideoSection({ videoUrl }: { videoUrl: string | null }) {
  const embedUrl = getEmbedUrl(videoUrl);
  // No video means no section. An empty placeholder adds noise, not information.
  if (!embedUrl) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-foreground shadow-float">
      <iframe
        src={embedUrl}
        title="Video lesson"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    </div>
  );
}
