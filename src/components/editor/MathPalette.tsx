"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (latex: string, mode: "inline" | "block") => void;
}

export default function MathPalette({
  open,
  onOpenChange,
  onInsert,
}: MathPaletteProps) {
  const [latex, setLatex] = useState("");
  const [mode, setMode] = useState<"inline" | "block">("inline");

  const insertTemplate = (template: string) => {
    setLatex((prev) => prev + template);
  };

  const handleInsert = () => {
    if (!latex.trim()) return;

    onInsert(latex, mode);

    setLatex("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Insert Mathematical Formula</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-8">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="fractions">Fractions</TabsTrigger>
            <TabsTrigger value="powers">Powers</TabsTrigger>
            <TabsTrigger value="roots">Roots</TabsTrigger>
            <TabsTrigger value="calculus">Calculus</TabsTrigger>
            <TabsTrigger value="greek">Greek</TabsTrigger>
            <TabsTrigger value="trig">Trig</TabsTrigger>
            <TabsTrigger value="matrix">Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
              {["+", "-", "=", "\\\\neq", "\\\\approx", "\\\\pm", "<", ">"].map(
                (s) => (
                  <Button
                    key={s}
                    variant="outline"
                    onClick={() => insertTemplate(s)}
                  >
                    <InlineMath math={s} />
                  </Button>
                ),
              )}
            </div>
          </TabsContent>

          <TabsContent value="fractions">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {["\\\\frac{1}{2}", "\\\\frac{a}{b}", "\\\\frac{x}{y}"].map(
                (s) => (
                  <Button
                    key={s}
                    variant="outline"
                    onClick={() => insertTemplate(s)}
                  >
                    <InlineMath math={s} />
                  </Button>
                ),
              )}
            </div>
          </TabsContent>

          <TabsContent value="powers">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {["x^2", "x^3", "x^n", "e^x"].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => insertTemplate(s)}
                >
                  <InlineMath math={s} />
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roots">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {["\\\\sqrt{x}", "\\\\sqrt{a+b}", "\\\\sqrt[n]{x}"].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => insertTemplate(s)}
                >
                  <InlineMath math={s} />
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calculus">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                "\\\\int",
                "\\\\int_a^b f(x)dx",
                "\\\\sum_{n=1}^{\\\\infty}",
                "\\\\lim_{x \\\\to 0}",
              ].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => insertTemplate(s)}
                >
                  <InlineMath math={s} />
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="greek">
            <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
              {[
                "\\\\alpha",
                "\\\\beta",
                "\\\\gamma",
                "\\\\theta",
                "\\\\lambda",
                "\\\\mu",
                "\\\\pi",
                "\\\\sigma",
              ].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => insertTemplate(s)}
                >
                  <InlineMath math={s} />
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trig">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                "\\\\sin(x)",
                "\\\\cos(x)",
                "\\\\tan(x)",
                "\\\\log(x)",
                "\\\\ln(x)",
              ].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => insertTemplate(s)}
                >
                  <InlineMath math={s} />
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matrix">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {[
                "\\\\begin{bmatrix}a & b\\\\\\\\ c & d\\\\end{bmatrix}",
                "\\\\begin{pmatrix}x\\\\\\\\y\\\\end{pmatrix}",
              ].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => insertTemplate(s)}
                >
                  Matrix
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={mode === "inline" ? "default" : "outline"}
              onClick={() => setMode("inline")}
            >
              Inline
            </Button>
            <Button
              variant={mode === "block" ? "default" : "outline"}
              onClick={() => setMode("block")}
            >
              Block
            </Button>
          </div>

          <Textarea
            rows={5}
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder="Type or paste a formula, e.g. x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
          />

          <div className="rounded-xl border bg-muted/30 p-4 min-h-[100px]">
            <p className="mb-2 text-sm font-medium">Preview</p>

            {latex ? (
              mode === "inline" ? (
                <InlineMath math={latex} />
              ) : (
                <BlockMath math={latex} />
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                Your formula preview will appear here.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsert}>Insert Formula</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
