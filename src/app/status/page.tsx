import Card from '../../components/Card';
import Layout from '../../components/Layout';
import MemoryStatus from '../../components/MemoryStatus';

export const metadata = {
  title: 'Status',
  description: 'System pulse, signal integrity, and entropy monitoring.'
};

const metrics = [
  { label: 'Server Pulse', value: 92 },
  { label: 'Signal Integrity', value: 78 },
  { label: 'Entropy', value: 41 },
  { label: 'Archive Sync', value: 88 }
];

export default function StatusPage() {
  return (
    <Layout>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Status</p>
        <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
          System integrity overview.
        </h1>
        <p className="text-sm text-slate-400">
          Live values are simulated. Drift remains within acceptable tolerances.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{metric.label}</span>
              <span>{metric.value}%</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-signal shadow-glow"
                style={{ width: `${metric.value}%` }}
              />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              checksum: {metric.value.toString(16)}-{metric.label.length}
            </p>
          </Card>
        ))}
      </div>
      <MemoryStatus />
    </Layout>
  );
}
