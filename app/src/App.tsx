import { useState } from 'react';
import { useConfigurator } from '@/hooks/useConfigurator';
import { ts } from '@/data/i18n';
import { LangBar } from '@/components/LangBar';
import { ControlsBar } from '@/components/ControlsBar';
import { TierRow } from '@/components/TierRow';
import { ConfigTabs } from '@/components/ConfigTabs';
import { ModelCard } from '@/components/ModelCard';
import { GroundSection } from '@/components/GroundSection';
import { Sidebar } from '@/components/Sidebar';
import { BottomToolbar, type View } from '@/components/BottomToolbar';
import { downloadOrderXlsx } from '@/data/export';
import type { ConfigSelections } from '@/types';
import './App.css';

export default function App() {
  const c = useConfigurator();
  const [view, setView] = useState<View>('configs');

  const exportXlsx = () => downloadOrderXlsx({
    groups: c.summary.groups,
    grandTotal: c.summary.grandTotal,
    cnyTotal: c.cnyTotal,
    usdTotal: c.usdTotal,
    pricing: c.pricing,
    tier: c.tier,
    lang: c.lang,
  });

  const showOrderInline = view === 'order';

  return (
    <>
      <LangBar lang={c.lang} onChangeLang={c.setLang} />
      {c.summary.hasAny && view === 'configs' && (
        <button className="mobile-total-bar" onClick={() => setView('order')}>
          <span className="mobile-total-label">{ts(c.lang, 'totalLbl')}</span>
          <span className="mobile-total-val">¥{c.cnyTotal.toLocaleString()} FOB</span>
          <span className="mobile-total-arrow">→</span>
        </button>
      )}
      <div className={`app view-${view}`}>
        <div className="main">
          {view === 'overview' && (
            <div className="static-view">
              <div className="header">
                <div className="logo">FPV CONFIGURATOR</div>
                <h1>{ts(c.lang, 'overviewTitle')}</h1>
              </div>
              <p className="static-body">{ts(c.lang, 'overviewBody')}</p>
              <button className="cta-btn" onClick={() => setView('configs')}>
                {ts(c.lang, 'tabConfigs')} →
              </button>
            </div>
          )}

          {view === 'contact' && (
            <div className="static-view">
              <div className="header">
                <div className="logo">FPV CONFIGURATOR</div>
                <h1>{ts(c.lang, 'contactTitle')}</h1>
              </div>
              <p className="static-body">{ts(c.lang, 'contactBody')}</p>
              <div className="contact-links">
                <a href="mailto:sales@example.com">✉ sales@example.com</a>
                <a href="https://t.me/example" target="_blank" rel="noopener">✈ Telegram</a>
                <a href="https://wa.me/00000000000" target="_blank" rel="noopener">💬 WhatsApp</a>
              </div>
            </div>
          )}

          {showOrderInline && (
            <div className="order-view">
              <div className="header">
                <div className="logo">FPV CONFIGURATOR</div>
                <h1>{ts(c.lang, 'summary')}</h1>
              </div>
              <Sidebar
                lang={c.lang}
                pricing={c.pricing}
                groups={c.summary.groups}
                grandTotal={c.summary.grandTotal}
                cnyTotal={c.cnyTotal}
                usdTotal={c.usdTotal}
                hasAny={c.summary.hasAny}
                multipleConfigs={c.configs.length > 1}
                sidebarOpen
                onClose={() => setView('configs')}
                onReset={c.resetCurrent}
                onExport={exportXlsx}
                inline
              />
            </div>
          )}

          {view === 'configs' && (
            <>
              <div className="header">
                <div className="logo">FPV CONFIGURATOR</div>
                <h1>{ts(c.lang, 'title')}</h1>
                <p className="header-sub">{ts(c.lang, 'sub')}</p>
              </div>

              <ControlsBar lang={c.lang} pricing={c.pricing} onPricingChange={c.setPricing} />
              <TierRow lang={c.lang} tier={c.tier} onTierChange={c.setTier} />
              <ConfigTabs
                lang={c.lang}
                configs={c.configs}
                activeConfigId={c.activeConfigId}
                onSelect={c.setActiveConfigId}
                onRemove={c.removeConfig}
              />

              <div id="models-container">
                {c.models.map(model => {
                  const qty = c.activeConfig.modelQtys[model.id] || 0;
                  return (
                    <div key={model.id}>
                      <ModelCard
                        model={model}
                        tier={c.tier}
                        lang={c.lang}
                        qty={qty}
                        selections={(c.activeConfig.selections[model.id] || { version: model.versions[0].id }) as ConfigSelections}
                        onQtyChange={q => c.setModelQty(model.id, q)}
                        onQtyDelta={delta => c.changeModelQty(model.id, delta)}
                        onSelectVersion={vid => c.selectVersion(model.id, vid)}
                        onSelectComponent={(secKey, itemId, type) => c.selectComponent(model.id, secKey, itemId, type)}
                      />
                      {qty > 0 && (
                        <>
                          <GroundSection
                            lang={c.lang}
                            tier={c.tier}
                            items={c.groundItems}
                            qtys={c.activeConfig.groundQtys || {}}
                            onQtyChange={c.setGroundQty}
                            onQtyDelta={(id, delta) => c.changeGroundQty(id, delta)}
                          />
                          <GroundSection
                            lang={c.lang}
                            tier={c.tier}
                            items={c.antennaItems}
                            qtys={c.activeConfig.groundQtys || {}}
                            onQtyChange={c.setGroundQty}
                            onQtyDelta={(id, delta) => c.changeGroundQty(id, delta)}
                            titleKey="antennas"
                            subKey="antennasSub"
                            grid
                          />
                          <button className="save-cfg-btn" onClick={c.addConfig}>
                            {ts(c.lang, 'saveCfg')}
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}

                <button className="add-cfg-btn" onClick={c.addConfig}>
                  {ts(c.lang, 'addCfg')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Desktop sidebar — visible on configs view; hidden on order view (inline) */}
        {view === 'configs' && (
          <Sidebar
            lang={c.lang}
            pricing={c.pricing}
            groups={c.summary.groups}
            grandTotal={c.summary.grandTotal}
            cnyTotal={c.cnyTotal}
            usdTotal={c.usdTotal}
            hasAny={c.summary.hasAny}
            multipleConfigs={c.configs.length > 1}
            sidebarOpen={false}
            onClose={() => {}}
            onReset={c.resetCurrent}
            onExport={exportXlsx}
          />
        )}
      </div>

      <BottomToolbar lang={c.lang} view={view} onChange={setView} />
    </>
  );
}
