"use client";
import { BookOpen, FileX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import './tiptapStyles.css';
import "katex/dist/katex.min.css";
import parse from "html-react-parser";
import { InlineMath, BlockMath } from "react-katex";


export function RichContentViewer({ content }: { content: string }) {



 


  
  if (!content || content.trim().length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            Study Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <FileX className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Content for this topic has not been added yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Please check back later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <BookOpen className="h-5 w-5 text-primary" />
          Study Content
        </CardTitle>
      </CardHeader>
      <CardContent className="border ">
        <div className="tiptap-content prose prose-slate dark:prose-invert max-w-none">
          {parse(content, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            replace(domNode: any) {
              // Block math from Tiptap
              if (
                domNode.name === "div" &&
                domNode.attribs?.["data-type"] === "block-math"
              ) {
                const latex = domNode.attribs?.["data-latex"] ?? "";

                return (
                  <div className="my-8 flex justify-center">
                    <BlockMath math={latex} />
                  </div>
                );
              }

              // Inline math from Tiptap
              if (
                domNode.name === "span" &&
                domNode.attribs?.["data-type"] === "inline-math"
              ) {
                const latex = domNode.attribs?.["data-latex"] ?? "";

                return <InlineMath math={latex} />;
              }

              return undefined;
            },
          })}
        </div>
      </CardContent>
    </Card>
  );
}
