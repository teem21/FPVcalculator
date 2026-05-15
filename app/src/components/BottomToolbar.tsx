import type { Lang } from '@/types';
import { ts } from '@/data/i18n';

export type View = 'overview' | 'configs' | 'order' | 'contact';

interface Props {
  lang: Lang;
  view: View;
  onChange: (v: View) => void;
}

const tabs: Array<{ id: View; icon: string; labelKey: 'tabOverview' | 'tabConfigs' | 'tabOrder' | 'tabContact' }> = [
  { id: 'overview', icon: 'analytics', labelKey: 'tabOverview' },
  { id: 'configs', icon: 'tune', labelKey: 'tabConfigs' },
  { id: 'order', icon: 'shopping_cart', labelKey: 'tabOrder' },
  { id: 'contact', icon: 'chat_bubble', labelKey: 'tabContact' },
];

export function BottomToolbar({ lang, view, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center px-4 h-16 shadow-inner">
      {tabs.map(t => {
        const active = view === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={
              'flex flex-col items-center justify-center pt-2 pb-1 relative transition-colors ' +
              (active ? 'text-primary' : 'text-on-surface-variant hover:text-primary')
            }
          >
            {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />}
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {t.icon}
            </span>
            <span className="font-label text-[9px] uppercase tracking-widest font-bold mt-1">{ts(lang, t.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
