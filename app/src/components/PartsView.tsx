import { useState } from 'react';
import type { Lang, Tier, ComponentSection, ComponentItem } from '@/types';
import { tierPrice } from '@/data/pricing';
import { ts, ta } from '@/data/i18n';
import { Lightbox } from './Lightbox';

interface Props {
  lang: Lang;
  tier: Tier;
  sections: ComponentSection[];
  groundItems: ComponentItem[];
  antennaItems: ComponentItem[];
}

// Placeholder "none / not selected" options that aren't real parts.
const SKIP = new Set(['cam_vtx_none', 'tx_none', 'fib_no', 'fib_0', 'ai_no']);

function PartRow({ item, tier, lang }: { item: ComponentItem; tier: Tier; lang: Lang }) {
  const [zoom, setZoom] = useState(false);
  const [open, setOpen] = useState(false);
  const price = tierPrice(item.prices, tier);
  const priceText = item.incl
    ? ts(lang, 'incl')
    : item.tbd
      ? ts(lang, 'tbd')
      : price != null
        ? `¥${price.toLocaleString()}`
        : '';
  const tierLabels = ta(lang, 'tiers');

  return (
    <div className={'rounded-lg border bg-white transition-colors ' + (open ? 'border-primary' : 'border-outline-variant hover:border-primary')}>
      {/* Whole card toggles the description */}
      <div
        onClick={() => setOpen(o => !o)}
        className="p-3 flex items-center gap-3 cursor-pointer"
      >
        {item.img && (
          <img
            src={item.img}
            alt={item.name}
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; }}
            onClick={e => { e.stopPropagation(); setZoom(true); }}
            title={ts(lang, 'zoomHint')}
            className="w-12 h-12 rounded-md object-cover border border-outline-variant bg-white shrink-0 cursor-zoom-in hover:brightness-95"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-on-surface">{item.name}</div>
          {item.sub && <div className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">{item.sub}</div>}
        </div>
        {priceText && (
          <span className={'text-xs font-bold shrink-0 tabular-nums ' + (item.incl ? 'text-secondary' : item.tbd ? 'text-on-surface-variant italic' : 'text-primary')}>
            {priceText}
          </span>
        )}
        <span className="material-symbols-outlined text-lg text-on-surface-variant shrink-0">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          {item.specs && (
            <div className="rounded-md bg-surface-container-low border border-outline-variant/60 p-2.5 space-y-0.5">
              {item.specs.split('\n').map((line, i) => (
                <div key={i} className="text-[10px] text-on-surface-variant leading-snug">{line}</div>
              ))}
            </div>
          )}
          {/* Price by volume tier */}
          <div className="rounded-md border border-outline-variant/60 divide-y divide-outline-variant/50">
            {tierLabels.map((label, ti) => {
              const p = tierPrice(item.prices, ti as Tier);
              const txt = item.incl ? ts(lang, 'incl') : item.tbd ? ts(lang, 'tbd') : p != null ? `¥${p.toLocaleString()}` : '—';
              return (
                <div key={ti} className={'flex items-center justify-between px-2.5 py-1.5 ' + (ti === tier ? 'bg-primary/5' : '')}>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</span>
                  <span className={'text-[11px] font-bold tabular-nums ' + (item.incl ? 'text-secondary' : item.tbd ? 'text-on-surface-variant italic' : 'text-on-surface')}>{txt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {zoom && item.img && (
        <Lightbox src={item.img} alt={item.name} onClose={() => setZoom(false)} />
      )}
    </div>
  );
}

export function PartsView({ lang, tier, sections, groundItems, antennaItems }: Props) {
  const catalog: Array<{ key: string; titleKey: string; items: ComponentItem[] }> = [
    ...sections.filter(s => s.key !== 'frame'),
    { key: 'ground', titleKey: 'ground', items: groundItems },
    { key: 'antennas', titleKey: 'antennas', items: antennaItems },
  ];

  return (
    <div className="space-y-6">
      {catalog.map(sec => {
        const items = sec.items.filter(it => !SKIP.has(it.id));
        if (!items.length) return null;
        return (
          <section key={sec.key}>
            <h2 className="text-sm font-headline font-bold text-on-surface mb-2">{ts(lang, sec.titleKey as never)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items.map(it => <PartRow key={it.id} item={it} tier={tier} lang={lang} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
