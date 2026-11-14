"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Same support address shown in the site footer.
const FEEDBACK_EMAIL = "delyte780@gmail.com";
const MAX_LENGTH = 2000;

const CATEGORIES = ["Bug report", "Suggestion", "Question", "Other"] as const;

/**
 * There is no feedback endpoint or table, so this form does not pretend to
 * submit anything: it opens the learner's email app with the message
 * pre-filled and addressed to support.
 */
export default function FeedbackPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Bug report");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please write your feedback first.");
      return;
    }
    setError(undefined);

    const name = (user?.user_metadata?.full_name as string | undefined) ?? "";
    const body = `${message.trim()}\n\n—\n${name}${name ? "\n" : ""}${user?.email ?? ""}`;
    const href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      `[${category}] Delyte Academy feedback`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    toast.info("Opening your email app. Press send there to finish.");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Send feedback"
        description="Found a bug or have an idea? Tell us and we’ll look into it as soon as we can."
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-foreground">
                What is this about?
              </legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "min-h-10 rounded-full border px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/40",
                      category === c
                        ? "border-primary bg-primary-soft text-primary-soft-foreground"
                        : "bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="feedback-message"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Your feedback
              </label>
              <Textarea
                id="feedback-message"
                rows={7}
                value={message}
                maxLength={MAX_LENGTH}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "feedback-error" : "feedback-count"}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(undefined);
                }}
                placeholder="What happened, or what would you like to see?"
                className="resize-none"
              />
              <div className="mt-1.5 flex items-center justify-between text-[13px]">
                {error ? (
                  <p id="feedback-error" role="alert" className="font-medium text-destructive">
                    {error}
                  </p>
                ) : (
                  <span />
                )}
                <p id="feedback-count" className="tabular-nums text-muted-foreground">
                  {message.length}/{MAX_LENGTH}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0" aria-hidden />
                Sent from your email app to {FEEDBACK_EMAIL}
              </p>
              <Button type="submit" variant="brand" size="lg">
                Compose email
                <Send aria-hidden />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
