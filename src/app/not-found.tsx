import Link from 'next/link';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout className="text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-mist">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-100">Signal lost.</h1>
      <p className="mt-4 text-sm text-slate-400">
        The channel does not exist or needs credentials.
      </p>
      <p className="mt-4 text-xs text-slate-600">base64: L251bGw=</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-100"
      >
        Return to intake
      </Link>
    </Layout>
  );
}
