import type { Lang } from '@/types';

const LANGS: Array<{ code: Lang; label: string }> = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
];

interface Props {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
}

export function LangBar({ lang, onChangeLang }: Props) {
  return (
    <div className="lang-bar">
      {LANGS.map(l => (
        <button
          key={l.code}
          className={`lang-btn${lang === l.code ? ' active' : ''}`}
          onClick={() => onChangeLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
