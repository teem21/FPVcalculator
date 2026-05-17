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

  // Pin defaults to the top of the list so the stock pick is always visible first.
  const sortedItems = [...section.items].sort((a, b) => {
    const ad = a.default ? 1 : 0;
    const bd = b.default ? 1 : 0;
    return bd - ad;
  });

  const selectedItems = sortedItems.filter(it => !!(selections as Record<string, unknown>)[it.id]);
  const preview = selectedItems.map(it => {
    const price = tierPrice(it.prices, tier);
    const priceTxt = it.incl ? ts(lang, 'incl') : it.tbd ? ts(lang, 'tbd') : price != null ? `¥${price.toLocaleString()}` : '';
    return priceTxt ? `${it.name} · ${priceTxt}` : it.name;
  }).join(', ');

  return (
    <div className="border-b border-outline-variant/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 group text-left"
      >
        <div className="flex flex-col min-w-0 flex-1">
          <span className={'text-[11px] font-bold uppercase tracking-wider ' + (open ? 'text-primary' : 'text-on-surface-variant')}>
            {section.titleKey}
          </span>
          {!open && preview && (
            <span className="text-xs font-bold text-on-surface mt-0.5 truncate">{preview}</span>
          )}
        </div>
        <span
          className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-transform"
          aria-label={ts(lang, open ? 'collapse' : 'expand')}
        >
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 bg-white">
          {sortedItems.map(item => (
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
