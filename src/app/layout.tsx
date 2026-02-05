import type { Metadata } from 'next';
import { DM_Serif_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import GhostTracker from '../components/GhostTracker';
import { getSessionUser } from '../lib/session';

const display = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const body = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aurascan.lol'),
  title: {
    default: 'AuraScan',
    template: '%s | AuraScan'
  },
  description: 'A personal console for quick scans, notes, and playful secrets.',
  keywords: [
    'AuraScan',
    'dashboard',
    'scanner',
    'notes',
    'signals',
    'easter eggs'
  ],
  openGraph: {
    title: 'AuraScan',
    description: 'A personal console for quick scans, notes, and playful secrets.',
    url: 'https://aurascan.lol',
    siteName: 'AuraScan',
    images: [{ url: '/opengraph-image' }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraScan',
    description: 'Scan for anomalies. Decode the quiet signals.',
    images: ['/opengraph-image']
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  },
  other: {
    'x-signal': 'YmV3YXJlIHRoZSBzdGlsbA==',
    'x-archive': 'cm91dGU6L251bGw=',
    'x-trace': 'rot13:fhprrffrlr',
    'x-residue': 'hex: 2f726571',
    'x-echo': 'base64: ZWNobzozNw==',
    'x-glyph': 'rot13: tnlcu'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getSessionUser();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-aurascan text-slate-100 antialiased">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 noise opacity-30" />
          <div className="absolute inset-0 scanlines" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <GhostTracker />
          <Navbar name={user.name} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <div
          className="hidden"
          dangerouslySetInnerHTML={{
            __html: '<!-- aGV4OmQ3NmY2MzZhNzY2OQ== -->'
          }}
        />
      </body>
    </html>
  );
}
