"use client";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./editorToolbar";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { uploadService } from "@/services/upload";
import Image from "@tiptap/extension-image";
import Mathematics from "@tiptap/extension-mathematics";
import "katex/dist/katex.min.css";
import MathPalette from "./MathPalette";


const lowlight = createLowlight(common);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [mathMode, setMathMode] = useState<"inline" | "block">("inline");

  console.log(mathMode);

  const params = useParams();
  const courseId = params.id as string;
  const topicId = params.topicsId as string;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
     Mathematics.configure({
    katexOptions: {
      throwOnError: false,
      output: "html",
    },
  }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      Link.configure({
        openOnClick: false,
      }),

      HorizontalRule,

      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],

    content: value || "<p></p>",

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maximum image size is 5MB.");
      return;
    }
    try {
      setUploadingImage(true);
      const imageUrl = await uploadService.uploadImage(
        file,
        "course-content",
        `${courseId}/${topicId}`
      );
      editor
        ?.chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: file.name,
        })
        .createParagraphNear()
        .focus()
        .run();
      toast.success("Image uploaded.");
    } catch (error) {
      console.error(error);

      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  };


  const handleInsertMath = (latex: string, mode: "inline" | "block") => {
    if (!editor) return;

    if (mode === "inline") {
      editor.chain().focus().insertInlineMath({ latex }).run();
    } else {
      editor.chain().focus().insertBlockMath({ latex }).run();
    }
  };

  return (
    <div className="rounded-xl border bg-background min-h-[500px] ">
      <div
        className="sticky
top-0
z-20
bg-background/95
backdrop-blur-md
border-b"
      >
        {" "}
        <EditorToolbar
          editor={editor}
          onInsertImage={() => imageInputRef.current?.click()}
          uploadingImage={uploadingImage}
          onOpenInlineMath={() => {
            setMathMode("inline");
            setMathOpen(true);
          }}
          onOpenBlockMath={() => {
            setMathMode("block");
            setMathOpen(true);
          }}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          hidden
          onChange={handleImageUpload}
        />
      </div>
      <div className="h-[70vh] overflow-y-auto">
        <EditorContent editor={editor} className="min-h-[500px] p-5" />
        <MathPalette
          open={mathOpen}
          onOpenChange={setMathOpen}
          onInsert={handleInsertMath}
        />
      </div>
    </div>
  );
}
