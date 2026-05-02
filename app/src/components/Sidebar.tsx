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
}

export function Sidebar({
  lang, pricing, groups, grandTotal, cnyTotal, usdTotal, hasAny,
  multipleConfigs, sidebarOpen, onClose, onReset, onExport,
}: Props) {
  return (
    <div className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
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
          <div>
            {groups.map(g => (
              <div key={g.configId}>
                <div className="sum-group-label">{g.groupLabel}</div>
                {g.items.map((it, i) => (
                  <div key={i} className="sum-row">
                    <span className="sum-name">{it.name}</span>
                    <span className="sum-qty">×{it.qty}</span>
                    <span className="sum-price">¥{it.price.toLocaleString()}</span>
                  </div>
                ))}
                {multipleConfigs && (
                  <div className="sum-row" style={{ borderTop: '1px dashed var(--border)', paddingTop: 5 }}>
                    <span className="sum-name" style={{ color: 'var(--text)', fontWeight: 500 }}>
                      {ts(lang, 'totalLbl')} {g.groupLabel}
                    </span>
                    <span />
                    <span className="sum-price" style={{ color: 'var(--accent)' }}>
                      ¥{g.total.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
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
