import { useState } from 'react';
import type { Lang, SummaryGroup, SummaryGroupKey, SummaryItem } from '@/types';
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
  onReset: () => void;
  onExport: () => void;
}

const GROUP_ORDER: SummaryGroupKey[] = ['drone', 'components', 'ground', 'antennas'];
const GROUP_LABEL_KEY: Record<SummaryGroupKey, 'grpDrone' | 'grpComponents' | 'grpGround' | 'grpAntennas'> = {
  drone: 'grpDrone',
  components: 'grpComponents',
  ground: 'grpGround',
  antennas: 'grpAntennas',
};

function groupItems(items: SummaryItem[]): Record<SummaryGroupKey, SummaryItem[]> {
  const out: Record<SummaryGroupKey, SummaryItem[]> = { drone: [], components: [], ground: [], antennas: [] };
  for (const it of items) out[it.group].push(it);
  return out;
}

function GroupBlock({
  gk, rows, lang, defaultOpen,
}: {
  gk: SummaryGroupKey;
  rows: SummaryItem[];
  lang: Lang;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const subtotal = rows.reduce((s, r) => s + r.price, 0);
  return (
    <div className="border-b border-outline-variant/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-3 py-2 flex items-center justify-between gap-3 hover:bg-surface-variant/40 transition-colors text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          {ts(lang, GROUP_LABEL_KEY[gk])}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-on-surface">¥{subtotal.toLocaleString()}</span>
          <span className="material-symbols-outlined text-on-surface-variant text-base">
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </span>
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-surface-container-low">
              <tr className="text-on-surface-variant uppercase tracking-wider text-[10px]">
                <th className="text-left font-bold py-1.5 px-3">{ts(lang, 'colName')}</th>
                <th className="text-right font-bold py-1.5 px-3 w-14">{ts(lang, 'colQty')}</th>
                <th className="text-right font-bold py-1.5 px-3 w-20">{ts(lang, 'colUnit')}</th>
                <th className="text-right font-bold py-1.5 px-3 w-20">{ts(lang, 'colTotal')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-outline-variant/30 last:border-b-0">
                  <td className="px-3 py-2">
                    <div className="font-medium text-on-surface">{r.name}</div>
                    {r.sub && <div className="text-[10px] text-on-surface-variant mt-0.5">{r.sub}</div>}
                  </td>
                  <td className="px-3 py-2 text-right text-on-surface-variant">×{r.qty}</td>
                  <td className="px-3 py-2 text-right text-on-surface-variant">¥{r.unitPrice.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-bold text-on-surface">¥{r.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ConfigInvoice({ group, lang }: { group: SummaryGroup; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const grouped = groupItems(group.items);
  const dronesText = ts(lang, 'totalDrones').replace('{n}', String(group.droneCount));

  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center justify-between gap-3 group hover:bg-surface-variant transition-colors text-left"
      >
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-headline font-bold text-on-surface text-sm truncate">{group.groupLabel}</span>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{dronesText}</span>
        </div>
        <span className="text-sm font-bold text-primary shrink-0">¥{group.total.toLocaleString()}</span>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="border-t border-outline-variant">
          {GROUP_ORDER.map(gk => {
            const rows = grouped[gk];
            if (!rows.length) return null;
            // drone block defaults open, others collapsed
            return (
              <GroupBlock
                key={gk}
                gk={gk}
                rows={rows}
                lang={lang}
                defaultOpen={gk === 'drone'}
              />
            );
          })}
          <div className="bg-primary text-on-primary px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-bold">{ts(lang, 'totalLbl')} · {group.groupLabel}</span>
            <span className="text-xs font-bold">¥{group.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrderView({ lang, pricing, groups, grandTotal, cnyTotal, usdTotal, hasAny, onReset, onExport }: Props) {
  if (!hasAny) {
    return (
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">receipt_long</span>
        <div className="text-sm text-on-surface-variant">{ts(lang, 'orderEmpty')}</div>
      </div>
    );
  }

  return (
    <div>
      {groups.map(g => (
        <ConfigInvoice key={g.configId} group={g} lang={lang} />
      ))}

      <div className="rounded-xl bg-surface-container-lowest border-2 border-primary p-4 mt-4 shadow-md">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{ts(lang, 'totalLbl')}</span>
          <span className="text-xl font-headline font-bold text-primary">¥{cnyTotal.toLocaleString()} FOB</span>
        </div>
        <div className="flex justify-end text-xs text-on-surface-variant mt-1">≈ ${usdTotal.toLocaleString()} FOB</div>
        <div className="text-[10px] text-on-surface-variant font-mono mt-2 break-all">
          ¥{grandTotal.toLocaleString()} × {pricing.fobK} = ¥{cnyTotal.toLocaleString()} ÷ {pricing.rate} = ${usdTotal.toLocaleString()}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {ts(lang, 'export')}
          </button>
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
