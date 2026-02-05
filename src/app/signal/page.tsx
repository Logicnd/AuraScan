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
            Live stream of console notes.
          </h1>
          <p className="text-sm text-slate-400">
            Lightweight feed for hints, updates, and a couple of planted easter eggs.
          </p>
        </div>
        <TerminalBlock title="Console">
          <p className="text-sm text-slate-300">
            Keep an eye on repeating lines—some unlock the null route faster.
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
