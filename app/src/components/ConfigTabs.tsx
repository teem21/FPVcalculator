import type { Lang, UserConfig } from '@/types';
import { ts } from '@/data/i18n';

interface Props {
  lang: Lang;
  configs: UserConfig[];
  activeConfigId: number;
  onSelect: (id: number) => void;
  onRemove: (id: number) => void;
}

export function ConfigTabs({ lang, configs, activeConfigId, onSelect, onRemove }: Props) {
  return (
    <section className="mb-8 flex gap-2 flex-wrap">
      {configs.map(cfg => {
        const totalQty = Object.values(cfg.modelQtys).reduce((a, b) => a + (b || 0), 0);
        const active = cfg.id === activeConfigId;
        return (
          <div
            key={cfg.id}
            onClick={() => onSelect(cfg.id)}
            className={
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ' +
              (active
                ? 'bg-primary/10 border-primary/30'
                : 'bg-surface-container-lowest border-outline-variant hover:border-primary')
            }
          >
            <span className={'text-xs ' + (active ? 'font-bold text-primary' : 'font-medium text-on-surface-variant')}>
              {ts(lang, 'cfg')} {cfg.id}
              {totalQty > 0 && ` (${totalQty} ${ts(lang, 'qty')})`}
            </span>
            {configs.length > 1 && (
              <span
                className="material-symbols-outlined text-xs text-primary hover:text-error"
                onClick={e => { e.stopPropagation(); onRemove(cfg.id); }}
              >
                close
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}
