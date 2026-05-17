import { useState } from 'react';
import type { Lang, Tier, DroneModel, ConfigSelections } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts } from '@/data/i18n';
import { ComponentItemRow } from './ComponentItem';
import { ComponentSection } from './ComponentSection';
import { NumberInput } from './NumberInput';

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

function QtyStepper({ qty, onDelta, onChange }: { qty: number; onDelta: (d: number) => void; onChange: (q: number) => void }) {
  return (
    <div className="inline-flex items-stretch bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden h-8">
      <button
        type="button"
        onClick={() => onDelta(-1)}
        className={'w-8 flex items-center justify-center transition-colors hover:bg-surface-variant ' + (qty > 0 ? 'text-primary' : 'text-on-surface-variant')}
      >
        <span className="material-symbols-outlined text-sm">remove</span>
      </button>
      <NumberInput
        value={qty}
        min={0}
        onChange={onChange}
        className="w-10 text-center text-xs font-bold text-on-surface bg-surface-container-lowest border-0 focus:outline-none focus:ring-0 p-0"
      />
      <button
        type="button"
        onClick={() => onDelta(1)}
        className="w-8 flex items-center justify-center text-primary transition-colors hover:bg-primary/5"
      >
        <span className="material-symbols-outlined text-sm">add</span>
      </button>
    </div>
  );
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

  const active = qty > 0;

  return (
    <div
      className={
        'rounded-xl overflow-hidden mb-4 ' +
        (active
          ? 'bg-surface-container-lowest border-2 border-primary shadow-md'
          : 'bg-surface-container-lowest border border-outline-variant')
      }
    >
      <div className="p-4 flex gap-4 items-center">
        <div className={'w-16 h-16 rounded-lg flex flex-col items-center justify-center shrink-0 ' + (active ? 'bg-primary text-on-primary' : 'bg-surface-container-low border border-outline-variant text-on-surface-variant')}>
          <div className="text-base font-headline font-bold tracking-tight leading-none">{model.label}</div>
          <div className={'text-[9px] font-bold tracking-widest uppercase mt-1 ' + (active ? 'text-on-primary/80' : 'text-on-surface-variant')}>{model.size}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-headline font-bold text-base text-on-surface truncate flex items-center gap-1.5">
              {active && (
                <span
                  className="material-symbols-outlined text-primary text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              )}
              <span className="truncate">{model.label} {ver.name}</span>
            </h3>
            {verPrice != null && (
              <span className={'font-bold text-sm whitespace-nowrap ' + (active ? 'text-primary' : 'text-on-surface-variant')}>
                ¥{verPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-on-surface-variant uppercase font-bold tracking-tighter mt-1 line-clamp-2">{model.sub}</p>
          <div className="mt-3 flex justify-end">
            <QtyStepper qty={qty} onDelta={onQtyDelta} onChange={onQtyChange} />
          </div>
        </div>
      </div>

      {active && (
        <div className="border-t border-outline-variant bg-surface-container-low">
          <div className="border-b border-outline-variant/50">
            <button
              type="button"
              onClick={() => setVersionOpen(o => !o)}
              className="w-full px-4 py-3 flex items-center justify-between gap-3 group text-left"
            >
              <div className="flex flex-col min-w-0 flex-1">
                <span className={'text-[11px] font-bold uppercase tracking-wider ' + (versionOpen ? 'text-primary' : 'text-on-surface-variant')}>
                  {ts(lang, 'versions')}
                </span>
                {!versionOpen && (
                  <span className="text-xs font-bold text-on-surface mt-0.5 truncate">{verPreview}</span>
                )}
              </div>
              <span
                className="material-symbols-outlined text-on-surface-variant group-hover:text-primary"
                aria-label={ts(lang, versionOpen ? 'collapse' : 'expand')}
              >
                {versionOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {versionOpen && (
              <div className="px-4 pb-4 space-y-2 bg-white">
                {[...model.versions]
                  .sort((a, b) => (a.id === model.versions[0].id ? -1 : b.id === model.versions[0].id ? 1 : 0))
                  .map(v => (
                    <ComponentItemRow
                      key={v.id}
                      item={{
                        id: v.id, name: v.name, sub: v.sub, prices: v.prices,
                        default: v.id === model.versions[0].id,
                      }}
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
