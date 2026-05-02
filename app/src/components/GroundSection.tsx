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
}

export function GroundSection({ lang, tier, items, qtys, onQtyChange, onQtyDelta }: Props) {
  return (
    <div className="model-card ground-card">
      <div className="model-top">
        <div className="model-info">
          <div className="model-title">{ts(lang, 'ground')}</div>
          <div className="model-sub">{ts(lang, 'groundSub')}</div>
        </div>
      </div>

      <div className="comp-area">
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
    </div>
  );
}
