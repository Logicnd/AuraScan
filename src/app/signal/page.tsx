import Layout from '../../components/Layout';
import SignalVisit from '../../components/SignalVisit';
import SignalStream from '../../components/SignalStream';
import TerminalBlock from '../../components/TerminalBlock';

export const metadata = {
  title: 'Signal Log',
  description: 'Intercepted transmissions and anomalies from the signal layer.'
};

export default function SignalPage() {
  return (
    <Layout>
      <SignalVisit />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Signal Log</p>
          <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
            Intercepted transmissions from the noise floor.
          </h1>
          <p className="text-sm text-slate-400">
            Streams are unstable. Copy fragments only when repetition confirms intent.
          </p>
        </div>
        <TerminalBlock title="Console">
          <p className="text-sm text-slate-300">
            Monitor live output for drift, then re-check archive sequences for overlap.
          </p>
          <p className="mt-4 text-xs text-slate-500">base64: L3N0YXR1cw==</p>
        </TerminalBlock>
      </div>
      <div className="mt-10">
        <SignalStream />
      </div>
    </Layout>
  );
}
