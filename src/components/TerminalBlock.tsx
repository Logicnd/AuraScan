import { ReactNode } from 'react';

type TerminalBlockProps = {
  title: string;
  children: ReactNode;
};

export default function TerminalBlock({ title, children }: TerminalBlockProps) {
  return (
    <div className="terminal aura-panel scanline-sweep relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-0 aura-grid opacity-20" />
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-signal/10 blur-3xl" />
      </div>
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-mist">
        <span className="relative z-10">{title}</span>
        <span className="relative z-10 h-2 w-2 animate-pulseSoft rounded-full bg-signal shadow-glow" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
