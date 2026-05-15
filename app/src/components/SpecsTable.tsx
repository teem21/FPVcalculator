import type { Lang } from '@/types';
import { FPV_MODELS, FPV_SPEC_ROWS, specLabel } from '@/data/specs';

interface Props { lang: Lang; }

const SHARED_ICON: Record<string, string> = {
  camera: 'photo_camera',
  ai: 'memory',
};

const SPECS_HEADER: Record<Lang, string> = {
  ru: 'ХАРАКТЕРИСТИКИ',
  en: 'SPECIFICATIONS',
  zh: '规格',
};

export function SpecsTable({ lang }: Props) {
  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <colgroup>
            <col className="w-44" />
            {FPV_MODELS.map(m => <col key={m} />)}
          </colgroup>
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {SPECS_HEADER[lang]}
              </th>
              {FPV_MODELS.map(m => (
                <th key={m} className="text-left py-4 px-4 text-sm font-headline font-bold text-primary">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FPV_SPEC_ROWS.map(row => {
              const isShared = !!row.shared;
              const icon = SHARED_ICON[row.key];
              return (
                <tr
                  key={row.key}
                  className={
                    'border-b border-outline-variant/50 last:border-b-0 ' +
                    (isShared ? 'bg-primary/5' : 'hover:bg-surface-variant/40 transition-colors')
                  }
                >
                  <td
                    className={
                      'px-4 py-3 align-middle text-xs ' +
                      (isShared
                        ? 'font-headline font-bold text-primary'
                        : 'text-on-surface-variant')
                    }
                  >
                    {specLabel(lang, row.key)}
                  </td>
                  {isShared ? (
                    <td
                      className="px-4 py-3 text-on-surface text-xs leading-relaxed"
                      colSpan={FPV_MODELS.length}
                    >
                      <div className="flex items-start gap-3">
                        {icon && (
                          <span
                            className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5"
                            style={{ fontVariationSettings: "'FILL' 0" }}
                          >
                            {icon}
                          </span>
                        )}
                        <span>{row.values[FPV_MODELS[0]]}</span>
                      </div>
                    </td>
                  ) : (
                    FPV_MODELS.map(m => (
                      <td key={m} className="px-4 py-3 text-xs text-on-surface font-medium">
                        {row.values[m]}
                      </td>
                    ))
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
