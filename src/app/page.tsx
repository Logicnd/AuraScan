const highlights = [
  {
    title: 'Scan-ready by default',
    detail: 'A clean scaffold with a focused layout, typography, and spacing.'
  },
  {
    title: 'Calm system, crisp UI',
    detail: 'Warm neutrals, teal accents, and soft gradients for legibility.'
  },
  {
    title: 'Room to grow',
    detail: 'Expandable sections for future routes, dashboards, and APIs.'
  }
];

const steps = [
  {
    label: '1. Define the core workflow',
    value: 'Map the scan, review, and report loop.'
  },
  {
    label: '2. Add data sources',
    value: 'Connect your model or pipeline integrations.'
  },
  {
    label: '3. Design the first dashboard',
    value: 'Prioritize signals, alerts, and user clarity.'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">
              AuraScan v2
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-6xl" style={{ fontFamily: 'var(--font-display)' }}>
              A fresh start for a calmer, sharper analysis workspace.
            </h1>
            <p className="max-w-xl text-lg text-slate-700">
              This scaffold replaces the previous app with a clean, intentional foundation.
              Use it to build a new scanning flow, reports dashboard, or decision suite.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:-translate-y-0.5 hover:bg-teal-800">
                Start building
              </button>
              <button className="rounded-full border border-slate-900/15 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
                View structure
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-900/10 bg-white/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Scaffold status</p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Ready
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-3xl font-semibold text-slate-900">3 focus lanes</p>
                <p className="text-sm text-slate-600">
                  The layout emphasizes a single flow: vision, build plan, and next actions.
                </p>
              </div>
              <div className="grid gap-3">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-slate-900/10 bg-white/60 p-8 backdrop-blur">
          <h2 className="text-3xl font-semibold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            Next steps that keep momentum
          </h2>
          <p className="text-base text-slate-700">
            Keep the build simple. Commit the first flow, then layer in data, alerts, and
            the interactive pieces that matter most.
          </p>
          <div className="grid gap-4">
            {steps.map((step) => (
              <div key={step.label} className="rounded-2xl border border-slate-900/10 bg-white px-5 py-4">
                <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                <p className="text-sm text-slate-600">{step.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-900/10 bg-teal-700 p-8 text-white shadow-[0_25px_60px_rgba(15,118,110,0.35)]">
            <p className="text-xs uppercase tracking-[0.35em] text-teal-100">Focus</p>
            <p className="mt-4 text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              Build around the signals that are hardest to ignore.
            </p>
            <p className="mt-4 text-sm text-teal-100">
              Start with the most important alerts. Everything else can be layered later.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-900/10 bg-white/70 p-6 backdrop-blur">
            <p className="text-sm font-semibold text-slate-800">Need a custom direction?</p>
            <p className="text-sm text-slate-600">
              Tell me the theme you want and I can tailor this scaffold to match it.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
