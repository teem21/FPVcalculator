import { useState } from 'react';
import type { Lang, SummaryGroup } from '@/types';
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

function ConfigCard({ group, lang, defaultOpen }: { group: SummaryGroup; lang: Lang; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`order-card${open ? ' open' : ''}`}>
      <button type="button" className="order-card-header" onClick={() => setOpen(o => !o)}>
        <div className="order-card-title">
          {group.groupLabel} · <span className="order-card-model">{group.modelLabel}</span>
          <span className="order-card-qty"> ×{group.modelQty}</span>
        </div>
        <div className="order-card-total">¥ {group.total.toLocaleString()}</div>
      </button>

      {!open ? (
        <div className="order-card-hint">{ts(lang, 'tapExpand')}</div>
      ) : (
        <div className="order-card-specs">
          {group.specs.map((s, i) => (
            <div key={i} className="spec-pair">
              <span className="spec-label">{s.label}</span>
              <span className="spec-dots" />
              <span className="spec-value">{s.value}</span>
            </div>
          ))}
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
        <ConfigCard key={g.configId} group={g} lang={lang} defaultOpen={i === 0} />
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
