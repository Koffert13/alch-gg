export interface CopperParts {
  negative: boolean;
  gold: number;
  silver: number;
  copper: number;
}

export function splitCopper(totalCopper: number): CopperParts {
  const rounded = Math.round(totalCopper);
  const negative = rounded < 0;
  const abs = Math.abs(rounded);
  const gold = Math.floor(abs / 10000);
  const silver = Math.floor((abs % 10000) / 100);
  const copper = abs % 100;
  return { negative, gold, silver, copper };
}

export function toCopper(gold: number, silver: number, copper: number): number {
  const g = Math.max(0, Math.floor(Number.isFinite(gold) ? gold : 0));
  const s = Math.max(0, Math.floor(Number.isFinite(silver) ? silver : 0));
  const c = Math.max(0, Math.floor(Number.isFinite(copper) ? copper : 0));
  return g * 10000 + s * 100 + c;
}

export function formatCopperText(totalCopper: number, showSign = false): string {
  const { negative, gold, silver, copper } = splitCopper(totalCopper);
  const sign = negative ? '-' : showSign && totalCopper > 0 ? '+' : '';
  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold.toLocaleString('en-US')}g`);
  if (silver > 0 || gold > 0) parts.push(`${silver}s`);
  if (copper > 0 || (gold === 0 && silver === 0)) parts.push(`${copper}c`);
  return `${sign}${parts.join(' ')}`;
}

export function formatRelativeTime(timestampMs: number, nowMs = Date.now()): string {
  const diffSec = Math.max(0, Math.floor((nowMs - timestampMs) / 1000));
  if (diffSec < 15) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ${diffMin % 60}m ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return 'READY';
  const totalSec = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
