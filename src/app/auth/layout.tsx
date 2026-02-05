import '../globals.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-aurascan text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 noise opacity-20" />
        <div className="absolute inset-0 scanlines" />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  );
}
