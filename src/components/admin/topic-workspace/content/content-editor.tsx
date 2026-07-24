"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Target,
  CheckSquare,
  ListChecks,
  Paperclip,
  Download,
  Upload,
  Trash2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentSection } from "./content-section";
import { EditableList } from "./editable-list";
import { TopicContentFormData } from "@/types/topic";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { formatSize, UploadAttachmentDialog } from "./upload-attachment-dialog";
import { useAttachments } from "@/hooks/useAttachments";
import { useParams } from "next/navigation";
import { TopicAttachment, UploadAttachmentForm } from "@/types/attachment";
import { getAttachmentMeta } from "@/lib/utils/file-icon";
import { Badge } from "@/components/ui/badge";

interface ContentTabEditorProps {
  data: TopicContentFormData;

  onChange: <K extends keyof TopicContentFormData>(
    field: K,
    value: TopicContentFormData[K]
  ) => void;

  addListItem: (field: "objectives" | "prerequisites") => void;

  updateListItem: (
    field: "objectives" | "prerequisites",
    index: number,
    value: string
  ) => void;

  removeListItem: (
    field: "objectives" | "prerequisites",
    index: number
  ) => void;
}

function AttachmentRow({
  attachment,
  onDelete,
}: {
  attachment: TopicAttachment;
  onDelete: (attachment: TopicAttachment) => void;
}) {
  const { Icon, color, bg } = getAttachmentMeta(attachment.file_name);

  return (
    <div className=" flex  gap-3 rounded-xl border bg-card p-3 transition-all duration-200 hover:shadow-sm flex-col">
      <div>
        {" "}
        <Badge className="border shadow bg-transparent text-black border-green-400 dark:text-white">{attachment.title}</Badge>
      </div>

      <div className="flex gap-2">
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
            bg,
            color
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 mb-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {attachment.file_name}{" "}
            <span className="ml-2 border shadow p-1 rounded-3xl border-red-400">
              {attachment.category}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {attachment.file_type} · {formatSize(attachment.file_size)}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <Button variant="outline" size="sm">
            <a
              href={attachment.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 text-xs  transition-opacity opacity-100 flex items-center"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground  transition-opacity hover:text-destructive "
            onClick={() => onDelete(attachment)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ContentEditor({
  data,
  onChange,
  addListItem,
  removeListItem,
  updateListItem,
}: ContentTabEditorProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const params = useParams();

  const courseId = params.id as string;

  const topicId = params.topicsId as string;
  const { attachments, uploading, uploadAttachment, deleteAttachment } =
    useAttachments(topicId);

  const handleUpload = async (values: UploadAttachmentForm) => {
    await uploadAttachment({
      topicId,
      description: values.description,
      category: values.category,
      courseId,

      title: values.title,

      file: values.file,
    });

    setUploadOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Section 1: Introduction */}
      <ContentSection
        id="introduction"
        icon={<BookOpen className="h-4 w-4" />}
        label="Introduction"
        accent="bg-blue-500/10 text-blue-600"
      >
        <Textarea
          value={data.introduction}
          onChange={(e) => onChange("introduction", e.target.value)}
          placeholder="Introduce this topic..."
          className="min-h-[120px] resize-y border-0 bg-transparent p-0 text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </ContentSection>
      {/* Section 2: Learning Objectives */}
      <ContentSection
        id="objectives"
        icon={<Target className="h-4 w-4" />}
        label="Learning Objectives"
        accent="bg-emerald-500/10 text-emerald-600"
      >
        <EditableList
          items={data.objectives}
          placeholder="Describe a learning objective..."
          addLabel="Add Objective"
          onAdd={() => addListItem("objectives")}
          onRemove={(index) => removeListItem("objectives", index)}
          onUpdate={(index, value) =>
            updateListItem("objectives", index, value)
          }
        />
      </ContentSection>
      {/* Section 3: Prerequisites */}
      <ContentSection
        id="prerequisites"
        icon={<CheckSquare className="h-4 w-4" />}
        label="Prerequisites"
        accent="bg-amber-500/10 text-amber-600"
      >
        <EditableList
          items={data.prerequisites}
          onAdd={() => addListItem("prerequisites")}
          onRemove={(index) => removeListItem("prerequisites", index)}
          onUpdate={(index, value) =>
            updateListItem("prerequisites", index, value)
          }
          placeholder="Describe a prerequisite..."
          addLabel="Add Prerequisite"
          accentColor="bg-amber-500/10 text-amber-600"
        />
      </ContentSection>
      {/* Section 4: Main Lesson Content */}
      <ContentSection
        id="main-content"
        icon={<FileText className="h-4 w-4" />}
        label="Main Lesson Content"
        accent="bg-violet-500/10 text-violet-600"
      >
        <RichTextEditor
          value={data.content}
          onChange={(value) => onChange("content", value)}
        />
      </ContentSection>{" "}
      {/* Section 5: Summary */}
      <ContentSection
        id="summary"
        icon={<ListChecks className="h-4 w-4" />}
        label="Summary"
        accent="bg-rose-500/10 text-rose-600"
      >
        <Textarea
          value={data.summary}
          onChange={(e) => onChange("summary", e.target.value)}
          placeholder="Summarize what the student learned in this topic..."
          className="min-h-[120px] resize-y border-0 bg-transparent p-0 text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </ContentSection>
      {/* Section 6: Attachments & Resources */}
      <ContentSection
        id="attachments"
        icon={<Paperclip className="h-4 w-4" />}
        label="Attachments"
        accent="bg-cyan-500/10 text-cyan-600"
      >
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-dashed py-6  transition-all duration-200 hover:border-primary/50 hover:bg-muted/40 hover:text-black hover:dark:text-white cursor-pointer"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Resource
          </Button>
          {attachments.map((attachment) => (
            <AttachmentRow
              key={attachment.id}
              attachment={attachment}
              onDelete={deleteAttachment}
            />
          ))}
        </div>
        <UploadAttachmentDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          uploading={uploading}
          onUpload={handleUpload}
        />
      </ContentSection>
    </div>
  );
}
