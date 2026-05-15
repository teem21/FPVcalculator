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
import { OrderView } from '@/components/OrderView';
import { BottomToolbar, type View } from '@/components/BottomToolbar';
import { SpecsTable } from '@/components/SpecsTable';
import { downloadOrderXlsx } from '@/data/export';
import type { ConfigSelections } from '@/types';
import './App.css';

function PageHeader({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <section className="mb-8">
      <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{kicker}</div>
      <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface mb-2">{title}</h1>
      {sub && <p className="text-on-surface-variant text-sm leading-relaxed">{sub}</p>}
    </section>
  );
}

export default function App() {
  const c = useConfigurator();
  const [view, setView] = useState<View>('configs');
  const [quickOpen, setQuickOpen] = useState(false);

  const exportXlsx = () => downloadOrderXlsx({
    groups: c.summary.groups,
    grandTotal: c.summary.grandTotal,
    cnyTotal: c.cnyTotal,
    usdTotal: c.usdTotal,
    pricing: c.pricing,
    tier: c.tier,
    lang: c.lang,
  });

  return (
    <>
      <LangBar lang={c.lang} onChangeLang={c.setLang} />

      <main className="px-4 py-6 max-w-md mx-auto">
        {view === 'overview' && (
          <>
            <PageHeader kicker="FPV CONFIGURATOR" title={ts(c.lang, 'overviewTitle')} />
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8">{ts(c.lang, 'overviewBody')}</p>

            <h2 className="text-lg font-headline font-bold text-on-surface mb-1">{ts(c.lang, 'specsTitle')}</h2>
            <p className="text-xs text-on-surface-variant mb-4">{ts(c.lang, 'specsSub')}</p>
            <SpecsTable lang={c.lang} />

            <button
              onClick={() => alert(ts(c.lang, 'downloadCompSpecsHint'))}
              title={ts(c.lang, 'downloadCompSpecsHint')}
              className="w-full mb-3 px-5 py-3 rounded-lg text-xs font-bold border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            >
              {ts(c.lang, 'downloadCompSpecs')}
            </button>

            <button
              onClick={() => setView('configs')}
              className="w-full px-5 py-3 rounded-lg text-xs font-bold bg-primary text-on-primary shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              {ts(c.lang, 'tabConfigs')} →
            </button>
          </>
        )}

        {view === 'contact' && (
          <>
            <PageHeader kicker="FPV CONFIGURATOR" title={ts(c.lang, 'contactTitle')} sub={ts(c.lang, 'contactBody')} />
            <div className="space-y-3">
              <a
                href="mailto:sales@example.com"
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="text-sm font-medium text-on-surface">sales@example.com</span>
              </a>
              <a
                href="https://t.me/example"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-primary">send</span>
                <span className="text-sm font-medium text-on-surface">Telegram</span>
              </a>
              <a
                href="https://wa.me/00000000000"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-primary">chat</span>
                <span className="text-sm font-medium text-on-surface">WhatsApp</span>
              </a>
            </div>
          </>
        )}

        {view === 'order' && (
          <>
            <PageHeader kicker="FPV CONFIGURATOR" title={ts(c.lang, 'summary')} />
            <OrderView
              lang={c.lang}
              pricing={c.pricing}
              groups={c.summary.groups}
              grandTotal={c.summary.grandTotal}
              cnyTotal={c.cnyTotal}
              usdTotal={c.usdTotal}
              hasAny={c.summary.hasAny}
              onReset={c.resetCurrent}
              onExport={exportXlsx}
            />
          </>
        )}

        {view === 'configs' && (
          <>
            <PageHeader kicker="FPV CONFIGURATOR" title={ts(c.lang, 'title')} sub={ts(c.lang, 'sub')} />

            <ControlsBar lang={c.lang} pricing={c.pricing} onPricingChange={c.setPricing} />
            <TierRow lang={c.lang} tier={c.tier} onTierChange={c.setTier} />
            <ConfigTabs
              lang={c.lang}
              configs={c.configs}
              activeConfigId={c.activeConfigId}
              onSelect={c.setActiveConfigId}
              onRemove={c.removeConfig}
            />

            <div className="space-y-4">
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
                        <button
                          onClick={c.addConfig}
                          className="w-full mt-2 px-5 py-3 rounded-lg text-xs font-bold border-2 border-dashed border-primary/50 text-primary hover:bg-primary/5 transition-colors"
                        >
                          {ts(c.lang, 'saveCfg')}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}

              <button
                onClick={c.addConfig}
                className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs font-bold bg-surface-container-lowest border border-dashed border-outline text-primary hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">add</span>
                {ts(c.lang, 'addCfg')}
              </button>
            </div>
          </>
        )}
      </main>

      {/* Quick-check bar (configs view, when there is anything) */}
      {view === 'configs' && c.summary.hasAny && (
        <div className="fixed bottom-16 left-0 w-full z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-t border-outline-variant flex items-center justify-between gap-3 shadow-lg">
          <button onClick={() => setQuickOpen(true)} className="flex flex-col items-start text-left flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{ts(c.lang, 'quickCheck')}</span>
            <span className="text-base font-headline font-bold text-primary truncate">¥{c.cnyTotal.toLocaleString()} FOB · ${c.usdTotal.toLocaleString()}</span>
          </button>
          <button
            onClick={exportXlsx}
            className="flex items-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-md shrink-0"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {ts(c.lang, 'quickDownload')}
          </button>
        </div>
      )}

      <Sidebar
        lang={c.lang}
        pricing={c.pricing}
        groups={c.summary.groups}
        grandTotal={c.summary.grandTotal}
        cnyTotal={c.cnyTotal}
        usdTotal={c.usdTotal}
        hasAny={c.summary.hasAny}
        multipleConfigs={c.configs.length > 1}
        sidebarOpen={quickOpen}
        onClose={() => setQuickOpen(false)}
        onReset={() => { c.resetCurrent(); setQuickOpen(false); }}
        onExport={exportXlsx}
      />

      <BottomToolbar lang={c.lang} view={view} onChange={setView} />
    </>
  );
}
