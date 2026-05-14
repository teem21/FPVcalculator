import { useState } from 'react';
import type { Lang, Tier, ComponentItem } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts } from '@/data/i18n';

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
    <div className={`model-card ground-card${open ? ' open' : ''}`}>
      <button type="button" className="ground-header" onClick={() => setOpen(o => !o)}>
        <div className="ground-header-info">
          <div className="model-title">{ts(lang, titleKey)}</div>
          <div className="model-sub">{ts(lang, subKey)}</div>
        </div>
        {preview && <span className="ground-preview">{preview}</span>}
        <span className="acc-toggle">
          <span className="acc-toggle-label">{ts(lang, open ? 'collapse' : 'expand')}</span>
          <span className="acc-toggle-tri" aria-hidden="true">▶</span>
        </span>
      </button>

      {open && (
        <div className={`comp-area${grid ? ' grid-2' : ''}`}>
          {items.map(item => {
            const price = tierPrice(item.prices, tier);
            const qty = qtys[item.id] || 0;
            return (
              <div key={item.id} className={`comp-item ground-row${qty > 0 ? ' selected' : ''}`}>
                <div className="comp-item-body">
                  <div className="comp-item-name">{item.name}</div>
                  <div className="comp-item-sub">{item.sub}</div>
                </div>
                <div className="comp-item-price">
                  {price != null ? `¥${price.toLocaleString()}` : ''}
                </div>
                <div className="model-qty ground-qty">
                  <button className="qty-btn" onClick={() => onQtyDelta(item.id, -1)}>−</button>
                  <input
                    className="qty-input"
                    type="number"
                    min="0"
                    value={qty}
                    onChange={e => onQtyChange(item.id, parseInt(e.target.value) || 0)}
                  />
                  <button className="qty-btn" onClick={() => onQtyDelta(item.id, 1)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
