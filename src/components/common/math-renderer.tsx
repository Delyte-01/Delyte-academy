"use client";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
text?: string | null;
}

export function MathRenderer({ text }: MathRendererProps) {
const value = (text ?? "").trim();

if (!value) return null;

// Block math: $$...$$
if (value.startsWith("$$") && value.endsWith("$$")) {
return <BlockMath math={value.slice(2, -2)} />;
}

// Block math: [...]
if (value.startsWith("[") && value.endsWith("\\]")) {
return <BlockMath math={value.slice(2, -2)} />;
}

// Inline math: $...$ and (...)
const regex = /(\$[^$]+\$|\\\([^)]*\\\))/g;
const parts = value.split(regex);

return (
<>
{parts.map((part, index) => {
if (part.startsWith("$") && part.endsWith("$")) {
return <InlineMath key={index} math={part.slice(1, -1)} />;
}


    if (part.startsWith("\\\\(") && part.endsWith("\\\\)")) {
      return <InlineMath key={index} math={part.slice(2, -2)} />;
    }

    return <span key={index}>{part}</span>;
  })}
</>

);
}
