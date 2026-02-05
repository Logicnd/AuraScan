import { redirect } from 'next/navigation';
import Container from '../../components/Container';
import TerminalBlock from '../../components/TerminalBlock';
import { getSessionUser } from '../../lib/session';
import AdminClient from '../../components/admin/AdminClient';

export const metadata = {
  title: 'Admin',
  description: 'Owner control deck with feature toggles and Bits controls.',
};

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!['OWNER', 'ADMIN'].includes(user.role)) {
    redirect('/');
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[160px]" />
        <div className="absolute right-10 top-32 h-[320px] w-[320px] rounded-full bg-amber-400/10 blur-[120px]" />
      </div>
      <Container className="py-12 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-mist">Owner Panel</p>
            <h1 className="text-4xl font-semibold text-slate-100">Admin / Feature control</h1>
            <p className="text-sm text-slate-400">
              Welcome back {user.username}. You have full control over feature flags, player balances, and global toggles. All actions are logged server-side.
            </p>
          </div>
          <TerminalBlock title="Identity">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Role</span>
                <span className="text-amber-200">{user.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tag</span>
                <span className="text-emerald-200">{user.tag}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bits</span>
                <span className="text-amber-200">{user.bits.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Path</span>
                <span>/admin</span>
              </div>
            </div>
          </TerminalBlock>
        </div>

        <AdminClient />
      </Container>
    </div>
  );
}
