import ArchiveGrid from '../../components/ArchiveGrid';
import Layout from '../../components/Layout';
import TerminalBlock from '../../components/TerminalBlock';

export const metadata = {
  title: 'Library',
  description: 'Browse saved sessions, notes, and signal fragments.'
};

export default function ArchivePage() {
  return (
    <Layout>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Library</p>
          <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
            Your stored sessions, neatly indexed.
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Lightweight logs, quick context, and just enough breadcrumbs to hint at what stays
            hidden.
          </p>
        </div>
        <TerminalBlock title="Tip">
          <p className="text-sm text-slate-300">
            Filter mentally for now. A smart filter arrives soon. Meanwhile, watch for off-pattern
            tags.
          </p>
          <p className="mt-4 text-xs text-slate-500">base64: L3NpZ25hbA==</p>
        </TerminalBlock>
      </div>
      <ArchiveGrid />
    </Layout>
  );
}
