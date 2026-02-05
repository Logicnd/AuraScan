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
    id: 'ghost-01',
    title: 'Ghost-01 / Persistent Signature',
    summary: 'A silent entry surfaced only after repeated scans.',
    date: '2026-02-05',
    clearance: 'A-0',
    tags: ['ghost', 'persistent', 'signature'],
    fragment: 'hex: 2f6563686f',
    details: [
      'Subject emits a stable imprint across cycles.',
      'Trace suggests recursive observation.',
      'Archive indicates memory retention beyond baseline.'
    ],
    hidden: ['base64: Z2hvc3Q6L2VjaG8='],
    requiresFlag: 'archive-ghost'
  },
  {
    id: 'delta-07',
    title: 'Delta-07 / Residual Glow',
    summary: 'Low-light resonance echoes found in coastal relay nodes.',
    date: '2026-02-02',
    clearance: 'C-2',
    tags: ['coast', 'low-light', 'echo'],
    fragment: 'base64: ZGVsdGE6L251bGw=',
    details: [
      'Spectral trace sustained for 42 seconds before decay.',
      'Ambient aura response registered above baseline.',
      'No correlated emissions from adjacent nodes.'
    ],
    hidden: ['rot13: qrgyn: rpub']
  },
  {
    id: 'hollow-19',
    title: 'Hollow-19 / Memory Bleed',
    summary: 'Repeating loops detected in inert archive segments.',
    date: '2026-01-28',
    clearance: 'B-4',
    tags: ['loop', 'residual', 'memory'],
    fragment: 'hex: 2f6e756c6c',
    details: [
      'Multiple observations indicate slow phase drift.',
      'Cross-check suggests no mechanical failure.',
      'Possible human imprint overlay.'
    ],
    hidden: ['binary: 01101110 01110101 01101100 01101100']
  },
  {
    id: 'iris-55',
    title: 'Iris-55 / Phantom Aperture',
    summary: 'High-frequency aperture event with no visual anchor.',
    date: '2026-01-21',
    clearance: 'A-1',
    tags: ['aperture', 'high-frequency', 'phantom'],
    fragment: 'rot13: vef: vsf',
    details: [
      'Brief flare preceded by harmonic drop.',
      'Archive node auto-flagged for silent review.',
      'No outbound signal present.'
    ],
    hidden: ['base64: L2VjaG8=']
  },
  {
    id: 'rift-32',
    title: 'Rift-32 / Static Bloom',
    summary: 'A static bloom pattern recurs every 2.1 hours.',
    date: '2026-01-12',
    clearance: 'B-3',
    tags: ['static', 'bloom', 'periodic'],
    fragment: 'binary: 01110010 01101001 01100110 01110100',
    details: [
      'Pulse aligns with dormant system cycles.',
      'No user activity detected at time of event.',
      'Archive layer shows faint glyph trace.'
    ],
    hidden: ['hex: 2f7369676e616c']
  },
  {
    id: 'sable-11',
    title: 'Sable-11 / Quiet Drift',
    summary: 'Extended drift pattern logged in southern relay.',
    date: '2025-12-31',
    clearance: 'C-1',
    tags: ['drift', 'quiet', 'southern'],
    fragment: 'base64: c2FibGU6L3NpZ25hbA==',
    details: [
      'Drift exceeded tolerance yet remained coherent.',
      'Sensor bloom indicates secondary influence.',
      'Log shows repeated trace key: "echo".'
    ],
    hidden: ['rot13: fnovyr-11']
  },
  {
    id: 'veil-04',
    title: 'Veil-04 / Residual Mirror',
    summary: 'Mirror response observed between two unrelated prompts.',
    date: '2025-12-18',
    clearance: 'B-1',
    tags: ['mirror', 'residual', 'sync'],
    fragment: 'hex: 2f61726368697665',
    details: [
      'Mirror response persists across test cycles.',
      'No direct link between sources.',
      'System flagged anomaly as "traceable".'
    ],
    hidden: ['base64: L3N0YXR1cw==']
  }
];
