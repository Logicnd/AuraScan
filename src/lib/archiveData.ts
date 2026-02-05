export type ArchiveEntry = {
  id: string;
  title: string;
  summary: string;
  date: string;
  clearance: string;
  tags: string[];
  fragment?: string;
  details: string[];
  hidden?: string[];
  requiresFlag?: string;
};

export const archiveEntries: ArchiveEntry[] = [
  {
    id: 'profile-01',
    title: 'Profile-01 / First login',
    summary: 'Welcome ping captured at initial entry.',
    date: '2026-02-05',
    clearance: 'A-0',
    tags: ['onboarding', 'presence'],
    fragment: 'hex: 2f64617368626f617264',
    details: [
      'Session cookie established.',
      'Greeting rendered with stored handle.',
      'No remote calls triggered.'
    ],
    hidden: ['base64: L3N0YXR1cw=='],
    requiresFlag: 'archive-ghost'
  },
  {
    id: 'delta-07',
    title: 'Delta-07 / UI polish',
    summary: 'Rounded icon, softer gradients, sharper copy.',
    date: '2026-02-02',
    clearance: 'C-2',
    tags: ['design', 'visual', 'icon'],
    fragment: 'base64: ZGVsdGE6L251bGw=',
    details: [
      'Navigation streamlined to core destinations.',
      'ARG tone reduced; easter eggs retained.',
      'Icon now circular to match the new chrome.'
    ],
    hidden: ['rot13: qrgyn: rpub']
  },
  {
    id: 'hollow-19',
    title: 'Hollow-19 / Session echo',
    summary: 'Handle remembered between visits.',
    date: '2026-01-28',
    clearance: 'B-4',
    tags: ['memory', 'session'],
    fragment: 'hex: 2f6e756c6c',
    details: [
      'Local storage mirrors cookie for quick greets.',
      'No personal data leaves the browser.',
      'Sign-out clears both layers.'
    ],
    hidden: ['binary: 01101110 01110101 01101100 01101100']
  },
  {
    id: 'iris-55',
    title: 'Iris-55 / Friendly greet',
    summary: 'Dashboard tone calibrated for everyday use.',
    date: '2026-01-21',
    clearance: 'A-1',
    tags: ['tone', 'ux'],
    fragment: 'rot13: vef: vsf',
    details: [
      'Removed heavy jargon while keeping depth.',
      'Hints remain for curious eyes.',
      'Greeting adapts to stored handle.'
    ],
    hidden: ['base64: L2VjaG8=']
  },
  {
    id: 'rift-32',
    title: 'Rift-32 / Hidden switch',
    summary: 'A subtle toggle unlocks an extra route.',
    date: '2026-01-12',
    clearance: 'B-3',
    tags: ['easter-egg', 'hidden'],
    fragment: 'binary: 01110010 01101001 01100110 01110100',
    details: [
      'Logo interactions still count, but with restraint.',
      'Null channel remains—quietly.',
      'Signal log hints at where to look.'
    ],
    hidden: ['hex: 2f7369676e616c']
  },
  {
    id: 'sable-11',
    title: 'Sable-11 / Quiet mode',
    summary: 'ARG elements dialed down to 10%.',
    date: '2025-12-31',
    clearance: 'C-1',
    tags: ['calm', 'minimal'],
    fragment: 'base64: c2FibGU6L3NpZ25hbA==',
    details: [
      'Copy trimmed for clarity.',
      'Visual noise reduced; intentional glow kept.',
      'Secrets left intact for the patient.'
    ],
    hidden: ['rot13: fnovyr-11']
  },
  {
    id: 'veil-04',
    title: 'Veil-04 / Mirror check',
    summary: 'Content mirrored between dashboard and library.',
    date: '2025-12-18',
    clearance: 'B-1',
    tags: ['consistency', 'ui'],
    fragment: 'hex: 2f61726368697665',
    details: [
      'Cards now reusable across sections.',
      'Typography aligned for dashboards.',
      'Easter egg copy remains in footnotes.'
    ],
    hidden: ['base64: L3N0YXR1cw==']
  }
];
