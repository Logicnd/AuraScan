import Layout from '../../components/Layout';
import ScanUI from '../../components/ScanUI';

export const metadata = {
  title: 'Lab',
  description: 'Deterministic scanner with clean output and playful easter eggs.'
};

export default function ScanPage() {
  return (
    <Layout>
      <div className="mb-8 space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Lab</p>
        <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
          Run a scan, keep it tidy.
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Every input returns the same output—no randomness, just reproducible insight. We tucked in
          a couple of hidden strings if you read between the lines.
        </p>
      </div>
      <ScanUI />
    </Layout>
  );
}
