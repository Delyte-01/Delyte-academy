"use client";

import { GripVertical, Plus, Trash2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { QuizOption } from "@/types/quiz";



interface QuestionOptionsProps {
  options: QuizOption[];
  onChange: (options: QuizOption[]) => void;
  quizId: string;
}

export function QuestionOptions({ options, onChange,quizId }: QuestionOptionsProps) {
 const updateOption = (id: string, text: string) => {
   onChange(
     options.map((o) =>
       o.id === id
         ? {
             ...o,
             option_text: text,
           }
         : o
     )
   );
 };

 const setCorrect = (id: string) => {
   onChange(
     options.map((o) => ({
       ...o,
       is_correct: o.id === id,
     }))
   );
 };
  
  
  const removeOption = (id: string) => {
    onChange(options.filter((o) => o.id !== id));
  };

 const addOption = () => {
   onChange([
     ...options,
     {
       id: crypto.randomUUID(),
       question_id: quizId,
       option_text: "",
       is_correct: false,
       order_index: options.length + 1,
     },
   ]);
 };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={option.id}
            className="group flex items-center gap-2 rounded-xl border bg-card p-2 transition-colors hover:bg-muted/30"
          >
            <div className="flex cursor-grab items-center text-muted-foreground/30 hover:text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>
            <button
              onClick={() => setCorrect(option.id)}
              className={cn(
                "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
               option.is_correct
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-muted-foreground/30 hover:border-primary/50"
              )}
            >
              {option.is_correct && <Radio className="h-2.5 w-2.5" />}
            </button>
            <Input
              value={option.option_text}
              onChange={(e) => updateOption(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="h-9 flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              onClick={() => removeOption(option.id)}
              disabled={options.length <= 2}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={addOption}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Option
      </Button>
    </div>
  );
}
