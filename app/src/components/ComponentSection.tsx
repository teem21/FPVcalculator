import { useState } from 'react';
import type { Lang, Tier, ComponentSection as CompSecType, ConfigSelections } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts } from '@/data/i18n';
import { ComponentItemRow } from './ComponentItem';

interface Props {
  section: CompSecType;
  tier: Tier;
  lang: Lang;
  selections: ConfigSelections;
  disabledIds?: string[];
  onSelect: (sectionKey: string, itemId: string, type: 'radio' | 'check') => void;
  defaultOpen?: boolean;
}

export function ComponentSection({ section, tier, lang, selections, disabledIds = [], onSelect, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const selectedItems = section.items.filter(it => !!(selections as Record<string, unknown>)[it.id]);
  const preview = selectedItems.map(it => {
    const price = tierPrice(it.prices, tier);
    const priceTxt = it.incl ? ts(lang, 'incl') : it.tbd ? ts(lang, 'tbd') : price != null ? `¥${price.toLocaleString()}` : '';
    return priceTxt ? `${it.name} · ${priceTxt}` : it.name;
  }).join(', ');

  return (
    <div className={`comp-sec${open ? ' open' : ''}`}>
      <button type="button" className="comp-sec-header" onClick={() => setOpen(o => !o)}>
        <div className="comp-sec-header-left">
          <span className="comp-sec-chevron">{open ? '▾' : '▸'}</span>
          <span className="comp-sec-title">{section.titleKey}</span>
        </div>
        {!open && preview && <span className="comp-sec-preview">{preview}</span>}
      </button>
      {open && (
        <div className="comp-sec-body">
          {section.items.map(item => (
            <ComponentItemRow
              key={item.id}
              item={item}
              tier={tier}
              lang={lang}
              type={section.type}
              selected={!!(selections as Record<string, unknown>)[item.id]}
              disabled={disabledIds.includes(item.id)}
              onClick={() => onSelect(section.key, item.id, section.type)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
