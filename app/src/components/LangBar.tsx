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
    <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-6 py-3 sticky top-0 z-50">
      <div className="text-xl font-headline font-bold tracking-tighter text-on-surface">AGR FPV</div>
      <div className="flex items-center gap-1 bg-surface-container-low rounded-full p-1 border border-outline-variant">
        {LANGS.map(l => (
          <button
            key={l.code}
            className={
              'px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors ' +
              (lang === l.code
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary')
            }
            onClick={() => onChangeLang(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </header>
  );
}
