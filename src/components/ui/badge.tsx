import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border text-[11px] font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-white',
        violet: 'border-violet-100 bg-violet-50 text-[#6D5BF5]',
        pink: 'border-pink-100 bg-pink-50 text-pink-500',
        outline: 'border-slate-200 text-slate-600',
        dot: 'border-transparent bg-emerald-50 text-emerald-600',
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
