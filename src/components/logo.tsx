import { Rocket } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-foreground ${className}`}>
      <div className="rounded-lg bg-primary p-2">
        <Rocket className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-headline text-xl font-bold">JobPilot AI</span>
    </div>
  );
}
