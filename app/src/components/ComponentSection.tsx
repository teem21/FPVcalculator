import type { Lang, Tier, ComponentSection as CompSecType, ConfigSelections } from '@/types';
import { ComponentItemRow } from './ComponentItem';

interface Props {
  section: CompSecType;
  tier: Tier;
  lang: Lang;
  selections: ConfigSelections;
  disabledIds?: string[];
  onSelect: (sectionKey: string, itemId: string, type: 'radio' | 'check') => void;
}

export function ComponentSection({ section, tier, lang, selections, disabledIds = [], onSelect }: Props) {
  return (
    <div>
      <div className="comp-sec-title">{section.titleKey}</div>
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
  );
}
