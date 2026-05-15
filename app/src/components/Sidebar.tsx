import { useState } from 'react';
import type { Lang } from '@/types';
import type { SummaryGroup } from '@/types';
import type { PricingParams } from '@/data/pricing';
import { ts } from '@/data/i18n';

interface Props {
  lang: Lang;
  pricing: PricingParams;
  groups: SummaryGroup[];
  grandTotal: number;
  cnyTotal: number;
  usdTotal: number;
  hasAny: boolean;
  multipleConfigs: boolean;
  sidebarOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onExport: () => void;
  inline?: boolean;
}

function ConfigBlock({ group, lang, defaultOpen }: { group: SummaryGroup; lang: Lang; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const dronesText = ts(lang, 'totalDrones').replace('{n}', String(group.droneCount));
  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 group hover:bg-surface-variant transition-colors text-left"
      >
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-bold text-on-surface truncate">{group.groupLabel}</span>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{dronesText}</span>
        </div>
        <span className="text-xs font-bold text-primary shrink-0">¥{group.total.toLocaleString()}</span>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && (
        <div className="border-t border-outline-variant p-3 space-y-2">
          {group.items.map((it, i) => (
            <div key={i} className="flex items-baseline justify-between gap-2 text-xs">
              <span className="text-on-surface flex-1 min-w-0">
                <span className="font-medium">{it.name}</span>
                <span className="text-[10px] text-on-surface-variant ml-1">¥{it.unitPrice.toLocaleString()}</span>
              </span>
              <span className="text-on-surface-variant text-[11px] shrink-0">×{it.qty}</span>
              <span className="font-bold text-on-surface text-[11px] shrink-0 w-20 text-right">¥{it.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant text-xs">
            <span className="font-bold text-on-surface">{ts(lang, 'totalLbl')} {group.groupLabel}</span>
            <span className="font-bold text-primary">¥{group.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  lang, pricing, groups, grandTotal, cnyTotal, usdTotal, hasAny,
  multipleConfigs, sidebarOpen, onClose, onReset, onExport,
}: Props) {
  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-on-surface/40" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-surface-container-low w-full sm:max-w-md rounded-t-xl sm:rounded-xl border border-outline-variant max-h-[90dvh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="font-headline font-bold text-lg text-on-surface">{ts(lang, 'summary')}</div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-primary">close</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!hasAny ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-2">flight</span>
              <div className="text-sm text-on-surface-variant whitespace-pre-line">{ts(lang, 'empty')}</div>
            </div>
          ) : (
            groups.map(g => (
              <ConfigBlock key={g.configId} group={g} lang={lang} defaultOpen={!multipleConfigs || groups.length === 1} />
            ))
          )}
        </div>

        {hasAny && (
          <div className="p-4 border-t border-outline-variant bg-surface-container-lowest space-y-2">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{ts(lang, 'totalLbl')}</div>
            <div className="text-xl font-headline font-bold text-primary">¥{cnyTotal.toLocaleString()} FOB</div>
            <div className="text-xs text-on-surface-variant">≈ ${usdTotal.toLocaleString()} FOB</div>
            <div className="text-[10px] text-on-surface-variant font-mono">
              ¥{grandTotal.toLocaleString()} × {pricing.fobK} = ¥{cnyTotal.toLocaleString()} ÷ {pricing.rate} = ${usdTotal.toLocaleString()}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-outline-variant flex gap-2">
          {hasAny && (
            <button
              onClick={onExport}
              className="flex-1 flex items-center justify-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              {ts(lang, 'export')}
            </button>
          )}
          <button
            onClick={onReset}
            className="flex-1 px-5 py-2.5 rounded-lg text-xs font-bold border border-outline-variant text-on-surface-variant hover:border-error hover:text-error transition-colors"
          >
            {ts(lang, 'reset')}
          </button>
        </div>
      </div>
    </div>
  );
}
