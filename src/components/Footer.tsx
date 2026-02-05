import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <Container className="flex flex-col items-start justify-between gap-6 py-10 text-sm text-slate-400 md:flex-row md:items-center">
        <div className="space-y-2">
          <p className="text-slate-200">AuraScan.lol</p>
          <p>Signal intake is experimental. Do not rely on output.</p>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/archive" className="hover-flicker">
            Archive
          </Link>
          <Link href="/status" className="hover-flicker">
            Status
          </Link>
          <a
            href="https://discord.gg/jxSCXNUW"
            target="_blank"
            rel="noreferrer"
            className="hover-glow flex items-center gap-2 rounded-full px-2 py-1 text-slate-300 hover:text-slate-100"
            aria-label="Join The Invisible Society on Discord"
            title="The Invisible Society"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 text-slate-200"
                fill="currentColor"
              >
                <path d="M19.64 4.45A18.06 18.06 0 0 0 15.66 3c-.2.35-.44.82-.6 1.19a17.2 17.2 0 0 0-5.12 0c-.17-.37-.4-.84-.6-1.19-1.39.24-2.73.68-3.98 1.45C2.5 8.1 2 11.69 2.25 15.22a18.3 18.3 0 0 0 5.53 2.78c.45-.62.85-1.29 1.18-1.99-.65-.25-1.28-.57-1.88-.95.16-.12.32-.25.47-.38 3.63 1.69 7.56 1.69 11.15 0 .16.13.31.26.47.38-.6.38-1.23.7-1.88.95.33.7.73 1.37 1.18 1.99a18.3 18.3 0 0 0 5.53-2.78c.37-4.1-.63-7.64-3.69-10.77ZM8.7 13.69c-.7 0-1.28-.65-1.28-1.45 0-.8.57-1.45 1.28-1.45.72 0 1.3.65 1.28 1.45 0 .8-.57 1.45-1.28 1.45Zm6.6 0c-.7 0-1.28-.65-1.28-1.45 0-.8.57-1.45 1.28-1.45.72 0 1.3.65 1.28 1.45 0 .8-.56 1.45-1.28 1.45Z" />
              </svg>
            </span>
            <span className="text-xs uppercase tracking-[0.2em]">The Invisible Society</span>
          </a>
          <Link
            href="/null"
            aria-label="Hidden channel"
            className="relative h-3 w-3 rounded-full border border-white/10 bg-white/5 text-[0px] opacity-40 hover:opacity-80"
          >
            .
          </Link>
        </div>
      </Container>
    </footer>
  );
}
