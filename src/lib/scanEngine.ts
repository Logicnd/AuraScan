import { buildScanResult, seedFromInput, type ScanResult } from './scanCore';

export type { ScanResult };

export function runScan(input: string): ScanResult {
  return buildScanResult(seedFromInput(input), input);
}
