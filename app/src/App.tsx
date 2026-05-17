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
      <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-on-surface mb-2">{title}</h1>
      {sub && <p className="text-on-surface-variant text-sm md:text-base leading-relaxed max-w-2xl">{sub}</p>}
    </section>
  );
}

export default function App() {
  const c = useConfigurator();
  const [view, setView] = useState<View>('configs');
  const [quickOpen, setQuickOpen] = useState(false);
  const [wechatOpen, setWechatOpen] = useState(false);

  const exportXlsx = () => downloadOrderXlsx({
    groups: c.summary.groups,
    grandTotal: c.summary.grandTotal,
    cnyTotal: c.cnyTotal,
    usdTotal: c.usdTotal,
    pricing: c.pricing,
    tier: c.tier,
    lang: c.lang,
  });

  const sidebarProps = {
    lang: c.lang,
    pricing: c.pricing,
    groups: c.summary.groups,
    grandTotal: c.summary.grandTotal,
    cnyTotal: c.cnyTotal,
    usdTotal: c.usdTotal,
    hasAny: c.summary.hasAny,
    multipleConfigs: c.configs.length > 1,
    onReset: c.resetCurrent,
    onExport: exportXlsx,
  };

  // Configurator main column (used as-is on mobile, as left column on xl+)
  const ConfigsMain = (
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
  );

  return (
    <>
      <LangBar lang={c.lang} onChangeLang={c.setLang} />

      <main className="px-4 md:px-6 py-6 max-w-md md:max-w-3xl xl:max-w-7xl mx-auto">
        {view === 'overview' && (
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <section className="mb-10">
              <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface mb-4 leading-[1.05]">
                {ts(c.lang, 'overviewTitle')}
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                {ts(c.lang, 'overviewBody')}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setView('configs')}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold bg-primary text-on-primary shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                >
                  <span>{ts(c.lang, 'tabConfigs')}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <a
                  href={c.lang === 'ru' ? '/specs/AGR-FPV-Spec-RU.docx' : '/specs/AGR-FPV-Spec-EN.docx'}
                  download
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">download</span>
                  <span>{ts(c.lang, 'downloadCompSpecs')}</span>
                </a>
              </div>
            </section>

            {/* Specs */}
            <section>
              <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight text-on-surface mb-1">
                {ts(c.lang, 'specsTitle')}
              </h2>
              <p className="text-sm text-on-surface-variant mb-6">{ts(c.lang, 'specsSub')}</p>
              <SpecsTable lang={c.lang} />
            </section>
          </div>
        )}

        {view === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <PageHeader kicker="FPV CONFIGURATOR" title={ts(c.lang, 'contactTitle')} sub={ts(c.lang, 'contactBody')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="mailto:tim@qifeizn.com"
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="text-sm font-medium text-on-surface truncate">tim@qifeizn.com</span>
              </a>
              <a
                href="https://t.me/baigarin_t1"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-primary">send</span>
                <span className="text-sm font-medium text-on-surface">Telegram · @baigarin_t1</span>
              </a>
              <a
                href="https://wa.link/2cpy3b"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-primary">chat</span>
                <span className="text-sm font-medium text-on-surface">WhatsApp · +7 747 988 8860</span>
              </a>
              <button
                type="button"
                onClick={() => setWechatOpen(true)}
                title="Baigarin_Zhan"
                className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors text-left"
              >
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
                <span className="text-sm font-medium text-on-surface">WeChat · Baigarin_Zhan</span>
              </button>
            </div>
          </div>
        )}

        {view === 'order' && (
          <div className="max-w-4xl mx-auto">
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
          </div>
        )}

        {view === 'configs' && (
          <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
            <div className="min-w-0">{ConfigsMain}</div>
            <div className="hidden xl:block">
              <Sidebar {...sidebarProps} sidebarOpen={false} onClose={() => {}} inline />
            </div>
          </div>
        )}
      </main>

      {/* Floating quick-check bar — mobile/tablet only; on xl the sidebar shows the same info */}
      {view === 'configs' && c.summary.hasAny && (
        <div className="fixed bottom-16 left-0 w-full z-40 xl:hidden bg-white/95 backdrop-blur-md px-4 py-3 border-t border-outline-variant shadow-lg">
          <div className="max-w-md md:max-w-3xl mx-auto flex items-center justify-between gap-3">
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
        </div>
      )}

      {/* Modal sidebar (mobile/tablet quick-check trigger) */}
      <Sidebar
        {...sidebarProps}
        sidebarOpen={quickOpen}
        onClose={() => setQuickOpen(false)}
        onReset={() => { c.resetCurrent(); setQuickOpen(false); }}
      />

      {wechatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-4"
          onClick={() => setWechatOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant w-full max-w-xs flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-outline-variant">
              <div className="font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
                WeChat
              </div>
              <button
                onClick={() => setWechatOpen(false)}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary"
              >
                close
              </button>
            </div>
            <img
              src="/specs/wechat-qr.png"
              alt="WeChat QR code"
              className="w-full h-auto p-4"
            />
            <div className="px-4 pb-4 flex flex-col gap-3">
              <div className="text-center text-sm font-bold text-on-surface">Baigarin_Zhan</div>
              <button
                onClick={() => { navigator.clipboard?.writeText('Baigarin_Zhan'); }}
                className="w-full flex items-center justify-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Baigarin_Zhan
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomToolbar lang={c.lang} view={view} onChange={setView} />
    </>
  );
}
