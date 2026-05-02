import { useConfigurator } from '@/hooks/useConfigurator';
import { ts } from '@/data/i18n';
import { LangBar } from '@/components/LangBar';
import { ControlsBar } from '@/components/ControlsBar';
import { TierRow } from '@/components/TierRow';
import { ConfigTabs } from '@/components/ConfigTabs';
import { ModelCard } from '@/components/ModelCard';
import { GroundSection } from '@/components/GroundSection';
import { Sidebar } from '@/components/Sidebar';
import { downloadOrderXlsx } from '@/data/export';
import type { ConfigSelections } from '@/types';
import './App.css';

export default function App() {
  const c = useConfigurator();

  return (
    <>
      <LangBar lang={c.lang} onChangeLang={c.setLang} />
      <div className="app">
        <div className="main">
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
        </div>

        {/* Mobile backdrop */}
        <div
          className={`sidebar-backdrop${c.sidebarOpen ? ' visible' : ''}`}
          onClick={() => c.setSidebarOpen(false)}
        />

        <Sidebar
          lang={c.lang}
          pricing={c.pricing}
          groups={c.summary.groups}
          grandTotal={c.summary.grandTotal}
          cnyTotal={c.cnyTotal}
          usdTotal={c.usdTotal}
          hasAny={c.summary.hasAny}
          multipleConfigs={c.configs.length > 1}
          sidebarOpen={c.sidebarOpen}
          onClose={() => c.setSidebarOpen(false)}
          onReset={c.resetCurrent}
          onExport={() => downloadOrderXlsx({
            groups: c.summary.groups,
            grandTotal: c.summary.grandTotal,
            cnyTotal: c.cnyTotal,
            usdTotal: c.usdTotal,
            pricing: c.pricing,
            tier: c.tier,
            lang: c.lang,
          })}
        />

        {/* Mobile FAB */}
        <button
          className="mobile-fab"
          onClick={() => c.setSidebarOpen(true)}
        >
          <span className="mobile-fab-icon">🛸</span>
          <span className="mobile-fab-label">
            {c.summary.hasAny ? `¥${c.cnyTotal.toLocaleString()}` : ts(c.lang, 'summary')}
          </span>
        </button>
      </div>
    </>
  );
}
