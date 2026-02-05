import Link from 'next/link';
import type { ArchiveEntry } from '../lib/archiveData';

type ArchiveCardProps = {
  entry: ArchiveEntry;
};

export default function ArchiveCard({ entry }: ArchiveCardProps) {
  return (
    <Link
      href={`/archive/${entry.id}`}
      aria-label={`Open archive entry ${entry.title}`}
      className="hover-flicker group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-signal/10 via-transparent to-halo/10" />
        <div className="absolute inset-0 animate-glide aura-grid opacity-30" />
      </div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-mist">
        <span>{entry.clearance}</span>
        <span>{entry.date}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-100 group-hover:text-signal">
        {entry.title}
      </h3>
      <p className="mt-2 text-sm text-slate-400">{entry.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-500">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="aura-chip rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
      {entry.fragment ? (
        <p className="mt-4 text-xs text-slate-500">{entry.fragment}</p>
      ) : null}
    </Link>
  );
}
