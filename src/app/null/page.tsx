import Layout from '../../components/Layout';
import TerminalBlock from '../../components/TerminalBlock';

export const metadata = {
  title: 'Null',
  description: 'The channel is empty.'
};

export default function NullPage() {
  return (
    <Layout>
      <TerminalBlock title="Null Channel">
        <p className="text-sm text-slate-300">
          This channel is unlisted. If you found it, keep the trace quiet.
        </p>
        <p className="mt-4 text-xs text-slate-500">base64: L2VjaG8=</p>
      </TerminalBlock>
    </Layout>
  );
}
