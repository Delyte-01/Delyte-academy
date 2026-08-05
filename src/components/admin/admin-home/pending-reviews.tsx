"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { PendingReview } from "./dashboard-data";

interface PendingReviewsProps {
  reviews: PendingReview[];
}

export function PendingReviews({ reviews }: PendingReviewsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Pending Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {reviews.map((review) => {
          const Icon = review.icon;
          return (
            <div
              key={review.id}
              className="flex items-start gap-3 rounded-2xl border p-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${review.bgColor}`}
              >
                <Icon className={`h-4.5 w-4.5 ${review.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {review.label}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {review.detail}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
