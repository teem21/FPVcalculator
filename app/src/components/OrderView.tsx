import { Fragment, useState } from 'react';
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

function ConfigInvoice({ group, lang, defaultOpen }: { group: SummaryGroup; lang: Lang; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const grouped = groupItems(group.items);
  const dronesText = ts(lang, 'totalDrones').replace('{n}', String(group.droneCount));

  let counter = 0;

  return (
    <div className={`order-config${open ? ' open' : ''}`}>
      <button type="button" className="order-config-header" onClick={() => setOpen(o => !o)}>
        <div className="order-config-titles">
          <div className="order-config-label">{group.groupLabel}</div>
          <div className="order-config-drones">{dronesText}</div>
        </div>
        <div className="order-config-total">¥{group.total.toLocaleString()}</div>
        <span className="acc-toggle" aria-label={ts(lang, open ? 'collapse' : 'expand')}>
          <svg className="acc-toggle-tri" viewBox="0 0 16 16" aria-hidden="true">
            <polygon points="4,2 13,8 4,14" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="order-config-body">
          <table className="order-table">
            <thead>
              <tr>
                <th className="col-no">{ts(lang, 'colNo')}</th>
                <th className="col-name">{ts(lang, 'colName')}</th>
                <th className="col-spec">{ts(lang, 'colSpec')}</th>
                <th className="col-qty">{ts(lang, 'colQty')}</th>
                <th className="col-unit">{ts(lang, 'colUnit')}</th>
                <th className="col-total">{ts(lang, 'colTotal')}</th>
              </tr>
            </thead>
            <tbody>
              {GROUP_ORDER.map(gk => {
                const rows = grouped[gk];
                if (!rows.length) return null;
                const subtotal = rows.reduce((s, r) => s + r.price, 0);
                return (
                  <Fragment key={gk}>
                    <tr className="order-table-group">
                      <td colSpan={6}>{ts(lang, GROUP_LABEL_KEY[gk])}</td>
                    </tr>
                    {rows.map((r, i) => {
                      counter++;
                      return (
                        <tr key={`${gk}-${i}`}>
                          <td className="col-no">{counter}</td>
                          <td className="col-name">{r.name}</td>
                          <td className="col-spec">{r.sub || '—'}</td>
                          <td className="col-qty">{r.qty}</td>
                          <td className="col-unit">¥{r.unitPrice.toLocaleString()}</td>
                          <td className="col-total">¥{r.price.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                    <tr className="order-table-subtotal">
                      <td />
                      <td colSpan={4}>{ts(lang, 'grpSubtotal')} · {ts(lang, GROUP_LABEL_KEY[gk])}</td>
                      <td className="col-total">¥{subtotal.toLocaleString()}</td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>{ts(lang, 'totalLbl')} · {group.groupLabel}</td>
                <td className="col-total">¥{group.total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export function OrderView({ lang, pricing, groups, grandTotal, cnyTotal, usdTotal, hasAny, onReset, onExport }: Props) {
  if (!hasAny) {
    return (
      <div className="order-page">
        <div className="order-empty">
          <div className="empty-icon">📋</div>
          <div className="empty-txt">{ts(lang, 'orderEmpty')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      {groups.map((g, i) => (
        <ConfigInvoice key={g.configId} group={g} lang={lang} defaultOpen={groups.length === 1 || i === 0} />
      ))}

      <div className="order-grand">
        <div className="order-grand-row">
          <span>{ts(lang, 'totalLbl')}</span>
          <span className="order-grand-cny">¥{cnyTotal.toLocaleString()} FOB</span>
        </div>
        <div className="order-grand-row order-grand-usd">
          <span />
          <span>≈ ${usdTotal.toLocaleString()} FOB</span>
        </div>
        <div className="order-grand-formula">
          ¥{grandTotal.toLocaleString()} × {pricing.fobK} = ¥{cnyTotal.toLocaleString()} ÷ {pricing.rate} = ${usdTotal.toLocaleString()}
        </div>
        <div className="order-actions">
          <button className="export-btn" onClick={onExport}>{ts(lang, 'export')}</button>
          <button className="reset-btn" onClick={onReset}>{ts(lang, 'reset')}</button>
        </div>
      </div>
    </div>
  );
}
