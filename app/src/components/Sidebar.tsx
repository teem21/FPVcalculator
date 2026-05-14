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
  const itemCount = group.items.length;
  return (
    <div className={`sum-group${open ? ' open' : ''}`}>
      <button type="button" className="sum-group-header" onClick={() => setOpen(o => !o)}>
        <span className="sum-group-label">{group.groupLabel}</span>
        <span className="sum-group-meta">{itemCount} · ¥{group.total.toLocaleString()}</span>
        <span className="acc-toggle">
          <span className="acc-toggle-label">{ts(lang, open ? 'collapse' : 'expand')}</span>
          <span className="acc-toggle-tri" aria-hidden="true">▶</span>
        </span>
      </button>
      {open && (
        <div className="sum-group-body">
          {group.items.map((it, i) => (
            <div key={i} className="sum-row">
              <span className="sum-name">
                {it.name} <span className="sum-unit">¥{it.unitPrice.toLocaleString()}</span>
              </span>
              <span className="sum-qty">×{it.qty}</span>
              <span className="sum-price">¥{it.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="sum-row sum-group-total">
            <span className="sum-name">{ts(lang, 'totalLbl')} {group.groupLabel}</span>
            <span />
            <span className="sum-price">¥{group.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  lang, pricing, groups, grandTotal, cnyTotal, usdTotal, hasAny,
  multipleConfigs, sidebarOpen, onClose, onReset, onExport, inline = false,
}: Props) {
  return (
    <div className={`sidebar${sidebarOpen ? ' open' : ''}${inline ? ' inline' : ''}`} id="sidebar">
      <div className="sidebar-sheet-header">
        <div className="sidebar-handle" />
        <div className="sidebar-head-row">
          <div className="sidebar-head">{ts(lang, 'summary')}</div>
          <button className="sidebar-close-btn" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="sidebar-head sidebar-head-desktop">
        {ts(lang, 'summary')}
      </div>

      <div className="sum-scroll">
        {!hasAny ? (
          <div className="empty-hint">
            <div className="empty-icon">🛸</div>
            <div className="empty-txt">
              {ts(lang, 'empty').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="sum-groups">
            {groups.map(g => (
              <ConfigBlock key={g.configId} group={g} lang={lang} defaultOpen={!multipleConfigs || groups.length === 1} />
            ))}
          </div>
        )}
      </div>

      {hasAny && (
        <div className="total-card">
          <div className="total-card-label">{ts(lang, 'totalLbl')}</div>
          <div className="total-cny">¥{cnyTotal.toLocaleString()} FOB</div>
          <div className="total-usd">≈ ${usdTotal.toLocaleString()} FOB</div>
          <div className="total-fob">
            ¥{grandTotal.toLocaleString()} × {pricing.fobK} = ¥{cnyTotal.toLocaleString()} ÷ {pricing.rate} = ${usdTotal.toLocaleString()}
          </div>
        </div>
      )}

      {hasAny && (
        <button className="export-btn" onClick={onExport}>
          {ts(lang, 'export')}
        </button>
      )}
      <button className="reset-btn" onClick={onReset}>
        {ts(lang, 'reset')}
      </button>
    </div>
  );
}
