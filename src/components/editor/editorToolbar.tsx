"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code2,
  Minus,
  Link2,
  Eraser,
  Image as ImageIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToolbarButton } from "./toolbarButton";
import "../editor/editorToolbar.css"

interface EditorToolbarProps {
  editor: Editor | null;
  onInsertImage: () => void;
  uploadingImage:boolean
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <Separator orientation="vertical" className="mx-1 h-6 bg-border/70" />;
}

export default function EditorToolbar({ editor ,onInsertImage,uploadingImage}: EditorToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div
        className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-2xl border-b border-border/60  bg-background/85 p-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
        role="toolbar"
        aria-label="Formatting toolbar"
      >
        {/* Text formatting */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Bold}
            label="Bold"
            shortcut="Ctrl+B"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={Italic}
            label="Italic"
            shortcut="Ctrl+I"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={Underline}
            label="Underline"
            shortcut="Ctrl+U"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Heading1}
            label="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          />
          <ToolbarButton
            icon={Heading2}
            label="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarGroup>
          <ToolbarButton
            icon={List}
            label="Bullet List"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="Numbered List"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarGroup>
          <ToolbarButton
            icon={AlignLeft}
            label="Align Left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          />
          <ToolbarButton
            icon={AlignCenter}
            label="Align Center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          />
          <ToolbarButton
            icon={AlignRight}
            label="Align Right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Blocks */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Quote}
            label="Block Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={Code2}
            label="Code Block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarButton
            icon={Minus}
            label="Horizontal Divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Insert */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Link2}
            label="Insert Link"
            active={editor.isActive("link")}
            onClick={setLink}
          />
          {/* Reserved for a future Image upload/insert action */}
          <ToolbarButton
            icon={ImageIcon}
            label="Image (coming soon)"
            disabled={ uploadingImage }
            onClick={onInsertImage}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Cleanup */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Eraser}
            label="Clear Formatting"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* History */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Undo2}
            label="Undo"
            shortcut="Ctrl+Z"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            icon={Redo2}
            label="Redo"
            shortcut="Ctrl+Shift+Z"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </ToolbarGroup>
      </div>
    </TooltipProvider>
  );
}
