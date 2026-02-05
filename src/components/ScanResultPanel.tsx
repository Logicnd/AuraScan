import type { ScanResult } from '../lib/scanEngine';

type ScanResultPanelProps = {
  result: ScanResult;
};

export default function ScanResultPanel({ result }: ScanResultPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-mist">
        <span>Result</span>
        <span className="text-signal">{result.confidence}%</span>
      </div>
      <div className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
        <div>
          <p className="text-slate-500">Aura Color</p>
          <p className="text-lg text-slate-100">{result.aura}</p>
        </div>
        <div>
          <p className="text-slate-500">Threat Rating</p>
          <p className="text-lg text-ember">{result.threat}</p>
        </div>
        <div>
          <p className="text-slate-500">Anomaly Index</p>
          <p className="text-lg text-slate-100">{result.anomalyIndex}</p>
        </div>
        <div>
          <p className="text-slate-500">Resonance Frequency</p>
          <p className="text-lg text-slate-100">{result.frequency} Hz</p>
        </div>
      </div>
      <div className="mt-6 text-sm text-slate-300">
        <p className="text-slate-500">Recommended Action</p>
        <p className="mt-2 text-slate-100">{result.action}</p>
      </div>
      <div className="mt-6 text-xs text-slate-500">
        {result.fragments.map((fragment) => (
          <p key={fragment}>{fragment}</p>
        ))}
      </div>
    </div>
  );
}
