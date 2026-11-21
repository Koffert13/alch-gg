import { splitCopper } from '../lib/currency';

interface CoinDisplayProps {
  copper: number;
  showSign?: boolean;
  tone?: 'neutral' | 'profit' | 'loss' | 'auto';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<CoinDisplayProps['size']>, string> = {
  xs: 'text-[11px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function CoinDisplay({
  copper,
  showSign = false,
  tone = 'neutral',
  size = 'sm',
  className = '',
}: CoinDisplayProps) {
  const { negative, gold, silver, copper: c } = splitCopper(copper);

  const effectiveTone =
    tone === 'auto' ? (copper > 0 ? 'profit' : copper < 0 ? 'loss' : 'neutral') : tone;

  const sign = negative ? '-' : showSign && copper > 0 ? '+' : '';

  const numberToneClass =
    effectiveTone === 'profit'
      ? 'text-emerald-400'
      : effectiveTone === 'loss'
        ? 'text-rose-400'
        : 'text-[#e7ece8]';

  return (
    <span
      className={`font-tabular inline-flex items-baseline gap-1 whitespace-nowrap font-medium ${SIZE_CLASSES[size]} ${className}`}
    >
      {sign && <span className={numberToneClass}>{sign}</span>}
      {gold > 0 && (
        <span className="inline-flex items-baseline">
          <span className={numberToneClass}>{gold.toLocaleString('en-US')}</span>
          <span className="ml-[1px] text-[#eab308]">g</span>
        </span>
      )}
      {(silver > 0 || gold > 0) && (
        <span className="inline-flex items-baseline">
          <span className={numberToneClass}>
            {gold > 0 ? String(silver).padStart(2, '0') : silver}
          </span>
          <span className="ml-[1px] text-[#cbd5e1]">s</span>
        </span>
      )}
      {(c > 0 || (gold === 0 && silver === 0)) && (
        <span className="inline-flex items-baseline">
          <span className={numberToneClass}>
            {gold > 0 || silver > 0 ? String(c).padStart(2, '0') : c}
          </span>
          <span className="ml-[1px] text-[#d97742]">c</span>
        </span>
      )}
    </span>
  );
}
