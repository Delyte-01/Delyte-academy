'use client';

import { BookX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyTopics() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
          <BookX className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">No topics have been added yet.</p>
          <p className="text-xs text-muted-foreground">
            Topics will appear here once they are published by the instructor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
