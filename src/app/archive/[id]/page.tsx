import { notFound } from 'next/navigation';
import Layout from '../../../components/Layout';
import TerminalBlock from '../../../components/TerminalBlock';
import { archiveEntries } from '../../../lib/archiveData';

type ArchivePageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return archiveEntries.map((entry) => ({ id: entry.id }));
}

export function generateMetadata({ params }: ArchivePageProps) {
  const entry = archiveEntries.find((item) => item.id === params.id);
  if (!entry) {
    return { title: 'Archive Entry' };
  }
  return {
    title: entry.title,
    description: entry.summary,
    other: {
      'x-trace': entry.hidden?.[0] ?? 'rot13: abg sbhaq'
    }
  };
}

export default function ArchiveEntryPage({ params }: ArchivePageProps) {
  const entry = archiveEntries.find((item) => item.id === params.id);
  if (!entry) {
    notFound();
  }

  return (
    <Layout>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-mist">{entry.clearance}</p>
          <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
            {entry.title}
          </h1>
          <p className="text-sm text-slate-400">{entry.summary}</p>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            {entry.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
          <div className="mt-8 text-xs text-slate-500">
            {entry.fragment}
            {entry.hidden?.map((hint) => (
              <p key={hint}>{hint}</p>
            ))}
          </div>
        </div>
        <TerminalBlock title="Trace Log">
          <div className="space-y-3 text-sm text-slate-300">
            <p>Date logged: {entry.date}</p>
            <p>Sector tag: {entry.tags.join(' / ')}</p>
            <p>Status: preserved</p>
          </div>
        </TerminalBlock>
      </div>
      <div
        className="hidden"
        dangerouslySetInnerHTML={{
          __html: '<!-- base64: L2FyY2hpdmU= -->'
        }}
      />
    </Layout>
  );
}
