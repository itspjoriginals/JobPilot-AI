import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, isCollapsed }: { className?: string, isCollapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 text-foreground", className)}>
      <div className="rounded-lg bg-primary p-2">
        <Rocket className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className={cn("font-headline text-xl font-bold", isCollapsed && "sr-only")}>JobPilot AI</span>
    </div>
  );
}
