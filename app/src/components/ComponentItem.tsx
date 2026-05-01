import type { Lang, Tier, ComponentItem as CompItemType, TagType } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts } from '@/data/i18n';

function Tag({ type }: { type: TagType }) {
  const cls = type === 'ai' ? 'tag-ai' : type === 'v2' ? 'tag-v2' : 'tag-top';
  const label = type === 'ai' ? 'AI' : type === 'v2' ? 'V2' : 'TOP★';
  return <span className={`tag ${cls}`}>{label}</span>;
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

  return (
    <div
      className={`comp-item${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      title={disabled ? '⚠ Несовместимо с выбранной камерой' : undefined}
    >
      <div className={`comp-indicator${type === 'check' ? ' check' : ''}`} />
      <div className="comp-item-body">
        <div className="comp-item-name">
          {item.name}
          {item.tag && <Tag type={item.tag} />}
        </div>
        <div className="comp-item-sub">{item.sub}</div>
      </div>
      <div
        className={`comp-item-price${item.incl ? ' incl' : ''}${item.tbd ? ' tbd' : ''}`}
      >
        {item.incl
          ? ts(lang, 'incl')
          : item.tbd
            ? ts(lang, 'tbd')
            : price != null
              ? `¥${price.toLocaleString()}`
              : ''}
      </div>
    </div>
  );
}
