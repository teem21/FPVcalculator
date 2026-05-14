import type { Lang } from '@/types';
import { ts } from '@/data/i18n';

export type View = 'overview' | 'configs' | 'order' | 'contact';

interface Props {
  lang: Lang;
  view: View;
  onChange: (v: View) => void;
}

const tabs: Array<{ id: View; icon: string; labelKey: 'tabOverview' | 'tabConfigs' | 'tabOrder' | 'tabContact'; mobileOnly?: boolean }> = [
  { id: 'overview', icon: '🏠', labelKey: 'tabOverview' },
  { id: 'configs', icon: '🛸', labelKey: 'tabConfigs' },
  { id: 'order', icon: '📋', labelKey: 'tabOrder', mobileOnly: true },
  { id: 'contact', icon: '✉', labelKey: 'tabContact' },
];

export function BottomToolbar({ lang, view, onChange }: Props) {
  return (
    <nav className="bottom-toolbar">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`bt-tab${view === t.id ? ' active' : ''}${t.mobileOnly ? ' mobile-only' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="bt-icon">{t.icon}</span>
          <span className="bt-label">{ts(lang, t.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
