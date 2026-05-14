import { useState } from 'react';
import type { Lang, Tier, DroneModel, ConfigSelections } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts } from '@/data/i18n';
import { ComponentItemRow } from './ComponentItem';
import { ComponentSection } from './ComponentSection';

interface Props {
  model: DroneModel;
  tier: Tier;
  lang: Lang;
  qty: number;
  selections: ConfigSelections;
  onQtyChange: (qty: number) => void;
  onQtyDelta: (delta: number) => void;
  onSelectVersion: (versionId: string) => void;
  onSelectComponent: (sectionKey: string, itemId: string, type: 'radio' | 'check') => void;
}

export function ModelCard({
  model, tier, lang, qty, selections,
  onQtyChange, onQtyDelta, onSelectVersion, onSelectComponent,
}: Props) {
  const ver = model.versions.find(v => v.id === selections.version) || model.versions[0];
  const verPrice = tierPrice(ver.prices, tier);

  const cameraSection = model.components.find(s => s.key === 'camera');
  const selectedCamera = cameraSection?.items.find(
    it => !!(selections as Record<string, unknown>)[it.id]
  );
  const vtxHidden = selectedCamera?.includesVtx ?? false;
  const aiBlocked = selectedCamera?.blocksAi ?? false;

  const [versionOpen, setVersionOpen] = useState(false);
  const verPreview = verPrice != null ? `${ver.name} · ¥${verPrice.toLocaleString()}` : ver.name;

  return (
    <div className={`model-card${qty > 0 ? ' active' : ''}`}>
      <div className="model-top">
        <div className="model-badge">
          <div className="m-name">{model.label}</div>
          <div className="m-size">{model.size}</div>
        </div>
        <div className="model-info">
          <div className="model-title">
            {model.label} {ver.name}
            {verPrice != null && <span className="model-price">¥{verPrice.toLocaleString()}</span>}
          </div>
          <div className="model-sub">{model.sub}</div>
        </div>
        <div className="model-qty">
          <button className="qty-btn" onClick={() => onQtyDelta(-1)}>−</button>
          <input
            className="qty-input"
            type="number"
            min="0"
            value={qty}
            onChange={e => onQtyChange(parseInt(e.target.value) || 0)}
          />
          <button className="qty-btn" onClick={() => onQtyDelta(1)}>+</button>
        </div>
      </div>

      {qty > 0 && (
        <div className="comp-area">
          <div className={`comp-sec${versionOpen ? ' open' : ''}`}>
            <button type="button" className="comp-sec-header" onClick={() => setVersionOpen(o => !o)}>
              <div className="comp-sec-header-left">
                <span className="comp-sec-chevron" aria-label={versionOpen ? 'collapse' : 'expand'}>▸</span>
                <span className="comp-sec-title">{ts(lang, 'versions')}</span>
              </div>
              {!versionOpen && <span className="comp-sec-preview">{verPreview}</span>}
            </button>
            {versionOpen && (
              <div className="comp-sec-body">
                {model.versions.map(v => (
                  <ComponentItemRow
                    key={v.id}
                    item={{ id: v.id, name: v.name, sub: v.sub, prices: v.prices }}
                    tier={tier}
                    lang={lang}
                    type="radio"
                    selected={selections.version === v.id}
                    onClick={() => onSelectVersion(v.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {model.components.map(sec => {
            if (sec.key === 'vtx' && vtxHidden) return null;
            const disabledIds = sec.key === 'ai' && aiBlocked
              ? sec.items.filter(it => it.id !== 'ai_no').map(it => it.id)
              : [];
            return (
              <ComponentSection
                key={sec.key}
                section={{ ...sec, titleKey: ts(lang, sec.titleKey as any) as string }}
                tier={tier}
                lang={lang}
                selections={selections}
                disabledIds={disabledIds}
                onSelect={onSelectComponent}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
