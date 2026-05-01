import { useState, useCallback, useMemo } from 'react';
import type { Lang, Tier, UserConfig, SummaryGroup, ConfigSelections } from '@/types';
import { getModels } from '@/data/models';
import { tierPrice, type PricingParams, DEFAULT_PRICING } from '@/data/pricing';
import { ts } from '@/data/i18n';

const MODEL_IDS = ['F10', 'F13', 'F15'] as const;

function createEmptyConfig(id: number): UserConfig {
  return {
    id,
    modelQtys: Object.fromEntries(MODEL_IDS.map(m => [m, 0])),
    selections: {},
  };
}

export function useConfigurator() {
  const [lang, setLang] = useState<Lang>('ru');
  const [tier, setTier] = useState<Tier>(0);
  const [pricing, setPricing] = useState<PricingParams>(DEFAULT_PRICING);
  const [configs, setConfigs] = useState<UserConfig[]>([createEmptyConfig(1)]);
  const [activeConfigId, setActiveConfigId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const models = useMemo(() => getModels(lang, pricing), [lang, pricing]);

  const activeConfig = configs.find(c => c.id === activeConfigId)!;

  const initSelections = useCallback((modelId: string, cfg: UserConfig) => {
    if (cfg.selections[modelId]) return cfg.selections[modelId];
    const model = models.find(m => m.id === modelId);
    if (!model) return { version: '' } as ConfigSelections;
    const sel: ConfigSelections = { version: model.versions[0].id };
    model.components.forEach(sec => {
      sec.items.forEach(it => {
        if (it.default) (sel as Record<string, boolean | string>)[it.id] = true;
      });
    });
    return sel;
  }, [models]);

  const ensureSelections = useCallback((cfg: UserConfig): UserConfig => {
    const newSel = { ...cfg.selections };
    let changed = false;
    MODEL_IDS.forEach(mid => {
      if (!newSel[mid]) {
        newSel[mid] = initSelections(mid, cfg);
        changed = true;
      }
    });
    return changed ? { ...cfg, selections: newSel } : cfg;
  }, [initSelections]);

  const updateActiveConfig = useCallback((updater: (cfg: UserConfig) => UserConfig) => {
    setConfigs(prev => prev.map(c => c.id === activeConfigId ? ensureSelections(updater(c)) : c));
  }, [activeConfigId, ensureSelections]);

  const setModelQty = useCallback((modelId: string, qty: number) => {
    updateActiveConfig(cfg => ({
      ...cfg,
      modelQtys: { ...cfg.modelQtys, [modelId]: Math.max(0, qty) },
    }));
  }, [updateActiveConfig]);

  const changeModelQty = useCallback((modelId: string, delta: number) => {
    updateActiveConfig(cfg => ({
      ...cfg,
      modelQtys: { ...cfg.modelQtys, [modelId]: Math.max(0, (cfg.modelQtys[modelId] || 0) + delta) },
    }));
  }, [updateActiveConfig]);

  const selectComponent = useCallback((modelId: string, sectionKey: string, itemId: string, sectionType: 'radio' | 'check') => {
    updateActiveConfig(cfg => {
      const sel = { ...cfg.selections[modelId] } as Record<string, boolean | string>;
      const model = models.find(m => m.id === modelId);
      const section = model?.components.find(s => s.key === sectionKey);
      if (!section) return cfg;

      if (sectionType === 'radio') {
        section.items.forEach(i => delete sel[i.id]);
        sel[itemId] = true;

        // If the selected camera blocks AI, reset AI section to ai_no
        if (sectionKey === 'camera') {
          const selectedItem = section.items.find(i => i.id === itemId);
          if (selectedItem?.blocksAi) {
            const aiSection = model?.components.find(s => s.key === 'ai');
            if (aiSection) {
              aiSection.items.forEach(i => delete sel[i.id]);
              sel['ai_no'] = true;
            }
          }
        }
      } else {
        if (sel[itemId]) delete sel[itemId];
        else sel[itemId] = true;
      }
      return { ...cfg, selections: { ...cfg.selections, [modelId]: sel as ConfigSelections } };
    });
  }, [updateActiveConfig, models]);

  const selectVersion = useCallback((modelId: string, versionId: string) => {
    updateActiveConfig(cfg => ({
      ...cfg,
      selections: {
        ...cfg.selections,
        [modelId]: { ...cfg.selections[modelId], version: versionId },
      },
    }));
  }, [updateActiveConfig]);

  const addConfig = useCallback(() => {
    const id = nextId;
    setNextId(n => n + 1);
    setConfigs(prev => [...prev, createEmptyConfig(id)]);
    setActiveConfigId(id);
  }, [nextId]);

  const removeConfig = useCallback((id: number) => {
    setConfigs(prev => {
      const next = prev.filter(c => c.id !== id);
      if (next.length === 0) return prev;
      if (activeConfigId === id) setActiveConfigId(next[0].id);
      return next;
    });
  }, [activeConfigId]);

  const resetCurrent = useCallback(() => {
    updateActiveConfig(cfg => ({
      ...cfg,
      modelQtys: Object.fromEntries(MODEL_IDS.map(m => [m, 0])),
      selections: {},
    }));
  }, [updateActiveConfig]);

  const summary = useMemo((): { groups: SummaryGroup[]; grandTotal: number; hasAny: boolean } => {
    let grandTotal = 0;
    let hasAny = false;
    const groups: SummaryGroup[] = [];

    configs.forEach(cfg => {
      const items: SummaryGroup['items'] = [];
      let cfgTotal = 0;

      models.forEach(model => {
        const qty = cfg.modelQtys[model.id] || 0;
        if (!qty) return;
        hasAny = true;
        const sel = cfg.selections[model.id];
        if (!sel) return;
        const ver = model.versions.find(v => v.id === sel.version) || model.versions[0];
        const bp = tierPrice(ver.prices, tier) || 0;
        const dt = bp * qty;
        cfgTotal += dt;
        grandTotal += dt;
        items.push({ name: `${model.label} ${ver.name}`, qty, price: dt });

        model.components.forEach(sec => {
          sec.items.forEach(it => {
            if (!(sel as Record<string, unknown>)[it.id]) return;
            if (it.incl || it.tbd || !it.prices) return;
            const up = tierPrice(it.prices, tier);
            if (!up) return;
            const tot = up * qty;
            cfgTotal += tot;
            grandTotal += tot;
            items.push({ name: it.name, qty, price: tot });
          });
        });
      });

      if (items.length) {
        groups.push({ groupLabel: `${ts(lang, 'cfg')} ${cfg.id}`, configId: cfg.id, items, total: cfgTotal });
      }
    });

    return { groups, grandTotal, hasAny };
  }, [configs, models, tier, lang]);

  const cnyTotal = useMemo(() => {
    return Math.round(summary.grandTotal * pricing.fobK);
  }, [summary.grandTotal, pricing.fobK]);

  const usdTotal = useMemo(() => {
    return Math.round(cnyTotal / pricing.rate);
  }, [cnyTotal, pricing.rate]);

  return {
    lang, setLang,
    tier, setTier,
    pricing, setPricing,
    configs, activeConfigId, setActiveConfigId,
    activeConfig: ensureSelections(activeConfig),
    models,
    setModelQty, changeModelQty,
    selectComponent, selectVersion,
    addConfig, removeConfig, resetCurrent,
    summary, cnyTotal, usdTotal,
    sidebarOpen, setSidebarOpen,
  };
}
