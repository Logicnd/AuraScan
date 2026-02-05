import Layout from '../../components/Layout';
import GhostWhisper from '../../components/GhostWhisper';
import ScanUI from '../../components/ScanUI';

export const metadata = {
  title: 'Scan',
  description: 'Run a deterministic aura scan and inspect the signal artifacts.'
};

export default function ScanPage() {
  return (
    <Layout>
      <div className="mb-10 space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Scanner</p>
        <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
          Run a scan on any name, phrase, or memory fragment.
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Output is deterministic. The system replays the same aura reading for identical
          inputs.
        </p>
        <GhostWhisper />
      </div>
      <ScanUI />
    </Layout>
  );
}
