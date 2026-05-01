import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { FlightStatus } from '@/types';

const statusBadgeVariants = cva(
  'inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm min-w-[110px] transition-all duration-200 backdrop-blur font-mono',
  {
    variants: {
      status: {
        'On Time': 'bg-gradient-to-r from-emerald-950/80 to-emerald-900/60 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:border-emerald-400/70',
        Boarding: 'bg-gradient-to-r from-amber-950/80 to-amber-900/60 text-amber-300 border border-amber-500/50 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:border-amber-400/70 animate-pulse',
        Departed: 'bg-gradient-to-r from-slate-800/80 to-slate-700/60 text-slate-400 border border-slate-600/50 shadow-lg shadow-slate-500/10',
        Delayed: 'bg-gradient-to-r from-orange-950/80 to-orange-900/60 text-orange-300 border border-orange-500/50 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:border-orange-400/70',
        Cancelled: 'bg-gradient-to-r from-red-950/80 to-red-900/60 text-red-400 border border-red-500/50 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:border-red-400/70',
      },
    },
    defaultVariants: {
      status: 'On Time',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: FlightStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <span className={cn(statusBadgeVariants({ status }), className)}>{status}</span>;
}
