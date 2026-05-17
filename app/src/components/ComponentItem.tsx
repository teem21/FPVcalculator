import type { Lang, Tier, ComponentItem as CompItemType, TagType } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts } from '@/data/i18n';

function Tag({ type }: { type: TagType }) {
  const cls =
    type === 'ai' ? 'bg-primary/10 text-primary' :
    type === 'v2' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
    'bg-error/10 text-error';
  const label = type === 'ai' ? 'AI' : type === 'v2' ? 'V2' : 'TOP★';
  return (
    <span className={`ml-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

interface Props {
  item: CompItemType;
  tier: Tier;
  lang: Lang;
  type: 'radio' | 'check';
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ComponentItemRow({ item, tier, lang, type, selected, disabled, onClick }: Props) {
  const price = tierPrice(item.prices, tier);
  const priceText = item.incl
    ? ts(lang, 'incl')
    : item.tbd
      ? ts(lang, 'tbd')
      : price != null
        ? `¥${price.toLocaleString()}`
        : '';

  return (
    <div
      onClick={disabled ? undefined : onClick}
      title={disabled ? '⚠ Несовместимо с выбранной камерой' : undefined}
      className={
        'p-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ' +
        (disabled
          ? 'border border-outline-variant bg-surface-container-low opacity-50 cursor-not-allowed'
          : selected
            ? 'border-2 border-primary bg-primary/5'
            : 'border border-outline-variant bg-white hover:border-primary')
      }
    >
      <div className="flex-1 min-w-0 pr-3">
        <div className={'text-xs flex items-center flex-wrap gap-x-1 ' + (selected ? 'font-bold text-on-surface' : 'font-medium text-on-surface')}>
          <span>{item.name}</span>
          {item.default && (
            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
              {ts(lang, 'defaultBadge')}
            </span>
          )}
          {item.tag && <Tag type={item.tag} />}
        </div>
        {item.sub && (
          <div className="text-[10px] text-on-surface-variant mt-0.5">{item.sub}</div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {priceText && (
          <span
            className={
              'text-[10px] font-bold ' +
              (item.incl ? 'text-secondary' : item.tbd ? 'text-on-surface-variant italic' : selected ? 'text-primary' : 'text-on-surface-variant')
            }
          >
            {priceText}
          </span>
        )}
        <span
          className="material-symbols-outlined text-lg"
          style={selected ? { fontVariationSettings: "'FILL' 1", color: '#004ac6' } : { color: '#737686' }}
        >
          {type === 'check'
            ? (selected ? 'check_box' : 'check_box_outline_blank')
            : (selected ? 'radio_button_checked' : 'radio_button_unchecked')}
        </span>
      </div>
    </div>
  );
}
