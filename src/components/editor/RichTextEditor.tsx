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

  const params = useParams();
  const courseId = params.id as string;
  const topicId = params.topicsId as string;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
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
      </div>
    </div>
  );
}
