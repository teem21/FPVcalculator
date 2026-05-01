import type { Lang, UserConfig } from '@/types';
import { ts } from '@/data/i18n';

interface Props {
  lang: Lang;
  configs: UserConfig[];
  activeConfigId: number;
  onSelect: (id: number) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}

export function ConfigTabs({ lang, configs, activeConfigId, onSelect, onAdd, onRemove }: Props) {
  return (
    <div className="configs-bar">
      {configs.map(cfg => {
        const totalQty = Object.values(cfg.modelQtys).reduce((a, b) => a + (b || 0), 0);
        return (
          <div
            key={cfg.id}
            className={`cfg-tab${cfg.id === activeConfigId ? ' active' : ''}`}
            onClick={() => onSelect(cfg.id)}
          >
            <span>
              {ts(lang, 'cfg')} {cfg.id}
              {totalQty > 0 && ` (${totalQty} ${ts(lang, 'qty')})`}
            </span>
            {configs.length > 1 && (
              <span
                className="cfg-close"
                onClick={e => { e.stopPropagation(); onRemove(cfg.id); }}
              >
                ×
              </span>
            )}
          </div>
        );
      })}
      <button className="cfg-add" onClick={onAdd}>
        {ts(lang, 'addCfg')}
      </button>
    </div>
  );
}
