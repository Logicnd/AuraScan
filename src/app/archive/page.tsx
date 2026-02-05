import ArchiveGrid from '../../components/ArchiveGrid';
import Layout from '../../components/Layout';
import TerminalBlock from '../../components/TerminalBlock';

export const metadata = {
  title: 'Archive',
  description: 'Browse archived scans and trace residual anomalies.'
};

export default function ArchivePage() {
  return (
    <Layout>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Archive</p>
          <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
            Archived scans from the last signal cycle.
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Each record includes a residual fragment. Some are corrupted. Some are not.
          </p>
        </div>
        <TerminalBlock title="Sector Notice">
          <p className="text-sm text-slate-300">
            Do not mirror archive entries in public logs. Use internal channels only.
          </p>
          <p className="mt-4 text-xs text-slate-500">base64: L251bGw=</p>
        </TerminalBlock>
      </div>
      <ArchiveGrid />
    </Layout>
  );
}
