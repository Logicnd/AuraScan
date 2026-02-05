import { ReactNode } from 'react';

type CardProps = {
  title?: string;
  eyebrow?: string;
  className?: string;
  children: ReactNode;
};

export default function Card({ title, eyebrow, className, children }: CardProps) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/5 p-6 ${className ?? ''}`}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.3em] text-mist">{eyebrow}</p>
      ) : null}
      {title ? (
        <h3 className="mt-3 text-lg font-semibold text-slate-100">{title}</h3>
      ) : null}
      {children}
    </div>
  );
}
