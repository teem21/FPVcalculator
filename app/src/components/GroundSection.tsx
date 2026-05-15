import { useState } from 'react';
import type { Lang, Tier, ComponentItem } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts } from '@/data/i18n';
import { NumberInput } from './NumberInput';

interface Props {
  lang: Lang;
  tier: Tier;
  items: ComponentItem[];
  qtys: Record<string, number>;
  onQtyChange: (itemId: string, qty: number) => void;
  onQtyDelta: (itemId: string, delta: number) => void;
  titleKey?: 'ground' | 'antennas';
  subKey?: 'groundSub' | 'antennasSub';
  grid?: boolean;
}

export function GroundSection({ lang, tier, items, qtys, onQtyChange, onQtyDelta, titleKey = 'ground', subKey = 'groundSub', grid = false }: Props) {
  const [open, setOpen] = useState(false);

  const selectedCount = items.reduce((n, it) => n + ((qtys[it.id] || 0) > 0 ? 1 : 0), 0);
  const selectedTotal = items.reduce((sum, it) => {
    const q = qtys[it.id] || 0;
    if (!q) return sum;
    const p = tierPrice(it.prices, tier);
    return sum + (p ? p * q : 0);
  }, 0);

  const preview = selectedCount > 0
    ? `${selectedCount} · ¥${selectedTotal.toLocaleString()}`
    : '';

  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden mb-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center justify-between gap-3 group hover:bg-surface-variant transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">
              {titleKey === 'antennas' ? 'settings_input_antenna' : 'router'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-on-surface text-sm">{ts(lang, titleKey)}</span>
            <span className="text-[11px] text-on-surface-variant truncate">{ts(lang, subKey)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {preview && <span className="text-[11px] font-bold text-primary">{preview}</span>}
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      {open && (
        <div className={'border-t border-outline-variant bg-white p-4 ' + (grid ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3')}>
          {items.map(item => {
            const price = tierPrice(item.prices, tier);
            const qty = qtys[item.id] || 0;
            const selected = qty > 0;
            return (
              <div
                key={item.id}
                className={
                  'p-3 rounded-lg flex items-center justify-between gap-3 ' +
                  (selected ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant bg-white')
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-on-surface">{item.name}</div>
                  {item.sub && <div className="text-[10px] text-on-surface-variant mt-0.5">{item.sub}</div>}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {price != null && (
                    <span className={'text-[10px] font-bold ' + (selected ? 'text-primary' : 'text-on-surface-variant')}>
                      ¥{price.toLocaleString()}
                    </span>
                  )}
                  <div className="flex items-stretch bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden h-8">
                    <button
                      type="button"
                      onClick={() => onQtyDelta(item.id, -1)}
                      className={'w-8 flex items-center justify-center transition-colors hover:bg-surface-variant ' + (qty > 0 ? 'text-primary' : 'text-on-surface-variant')}
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <NumberInput
                      value={qty}
                      min={0}
                      onChange={n => onQtyChange(item.id, n)}
                      className="w-10 text-center text-xs font-bold text-on-surface bg-surface-container-lowest border-0 focus:outline-none focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => onQtyDelta(item.id, 1)}
                      className="w-8 flex items-center justify-center text-primary transition-colors hover:bg-primary/5"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
