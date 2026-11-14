"use client";

import { useEffect, useRef } from "react";
import parse from "html-react-parser";
import { InlineMath, BlockMath } from "react-katex";
import "./tiptapStyles.css";
import "katex/dist/katex.min.css";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface RichContentViewerProps {
  content: string;
  /** Receives h2/h3 headings after render, for the "On this page" outline. Pass a stable function (e.g. a state setter). */
  onHeadings?: (headings: Heading[]) => void;
}

export function RichContentViewer({
  content,
  onHeadings,
}: RichContentViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isEmpty = !content || content.trim().length === 0;

  useEffect(() => {
    if (!onHeadings) return;
    const nodes = Array.from(
      ref.current?.querySelectorAll<HTMLElement>("h2, h3") ?? [],
    );
    onHeadings(
      nodes
        .map((node, i) => {
          if (!node.id) node.id = `section-${i}`;
          return {
            id: node.id,
            text: node.textContent?.trim() ?? "",
            level: (node.tagName === "H2" ? 2 : 3) as 2 | 3,
          };
        })
        .filter((h) => h.text),
    );
  }, [content, onHeadings]);

  if (isEmpty) {
    return (
      <div
        id="lesson-content"
        className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center"
      >
        <p className="text-sm font-semibold">
          This lesson doesn&apos;t have content yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Check back soon.</p>
      </div>
    );
  }

  return (
    <article id="lesson-content" className="study-reading-shell">
      <div ref={ref} className="tiptap-content study-reading-content">
        {parse(content, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          replace(domNode: any) {
            if (
              domNode.name === "div" &&
              domNode.attribs?.["data-type"] === "block-math"
            ) {
              return (
                <div className="study-block-math">
                  <BlockMath math={domNode.attribs?.["data-latex"] ?? ""} />
                </div>
              );
            }
            if (
              domNode.name === "span" &&
              domNode.attribs?.["data-type"] === "inline-math"
            ) {
              return (
                <InlineMath math={domNode.attribs?.["data-latex"] ?? ""} />
              );
            }
            return undefined;
          },
        })}
      </div>
    </article>
  );
}
