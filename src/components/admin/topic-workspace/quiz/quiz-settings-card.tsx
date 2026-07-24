"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";
import {  QuizSettingsForm } from "@/types/quiz";

interface QuizSettingsCardProps {
  settings: QuizSettingsForm;
  onChange: (settings: QuizSettingsForm) => void;
}

export function QuizSettingsCard({
  settings,
  onChange,
}: QuizSettingsCardProps) {
  const update = <K extends keyof QuizSettingsForm>(key: K, value: QuizSettingsForm[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const switches: {
    key: keyof QuizSettingsForm;
    label: string;
    description: string;
  }[] = [
    {
      key: "shuffleQuestions",
      label: "Shuffle Questions",
      description: "Randomize question order for each attempt",
    },
    {
      key: "shuffleOptions",
      label: "Shuffle Options",
      description: "Randomize answer options within each question",
    },
    {
      key: "showCorrectAnswers",
      label: "Show Correct Answers",
      description: "Reveal correct answers after submission",
    },
    {
      key: "requirePassingScore",
      label: "Require Passing Score",
      description: "Students must meet the passing threshold",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Settings2 className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-bold">Quiz Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Text fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quiz-title" className="text-sm font-semibold">
              Quiz Title
            </Label>
            <Input
              id="quiz-title"
              value={settings.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Example: Algebra Basics Quiz"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="quiz-passing-score"
              className="text-sm font-semibold"
            >
              Passing Score (%)
            </Label>
            <Input
              id="quiz-passing-score"
              type="number"
              min={0}
              max={100}
              value={settings.passingScore}
              onChange={(e) => update("passingScore", Number(e.target.value))}
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quiz-description" className="text-sm font-semibold">
            Quiz Description
          </Label>
          <Input
            id="quiz-description"
            value={settings.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Brief description of this quiz"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quiz-instructions" className="text-sm font-semibold">
            Instructions
          </Label>
          <Textarea
            id="quiz-instructions"
            value={settings?.instructions ?? ""}
            onChange={(e) => update("instructions", e.target.value)}
            placeholder="Instructions for students before they begin..."
            className="min-h-[80px] resize-y"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quiz-time-limit" className="text-sm font-semibold">
              Time Limit (minutes)
            </Label>
            <Input
              id="quiz-time-limit"
              type="number"
              min={0}
              value={settings.timeLimit}
              onChange={(e) => update("timeLimit", Number(e.target.value))}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="quiz-max-attempts"
              className="text-sm font-semibold"
            >
              Maximum Attempts
            </Label>
            <Input
              id="quiz-max-attempts"
              type="number"
              min={1}
              value={settings.maxAttempts}
              onChange={(e) => update("maxAttempts", Number(e.target.value))}
              className="h-10"
            />
          </div>
        </div>

        {/* Switches */}
        <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
          {switches.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border-b py-3 last:border-0 last:pb-0 first:pt-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Switch
                checked={settings[key] as boolean}
                onCheckedChange={(checked) => update(key, checked as never)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
