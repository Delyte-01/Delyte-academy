import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border text-xs font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-foreground text-background',
        brand: 'border-transparent bg-primary-soft text-primary-soft-foreground',
        success: 'border-transparent bg-success-soft text-success',
        warning: 'border-transparent bg-warning-soft text-warning',
        danger: 'border-transparent bg-destructive/10 text-destructive',
        info: 'border-transparent bg-info-soft text-info',
        muted: 'border-transparent bg-muted text-muted-foreground',
        outline: 'border-border text-muted-foreground',
        // legacy names, now token-based
        violet: 'border-transparent bg-info-soft text-info',
        pink: 'border-transparent bg-destructive/10 text-destructive',
        dot: 'border-transparent bg-success-soft text-success',
      },
      size: {
        default: 'px-2.5 py-1',
        sm: 'px-2 py-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
