import type { Lang } from '@/types';
import { FPV_MODELS, FPV_SPEC_ROWS, specLabel } from '@/data/specs';

interface Props { lang: Lang; }

export function SpecsTable({ lang }: Props) {
  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-primary/5">
            <tr>
              <th className="text-left py-2 px-3" />
              {FPV_MODELS.map(m => (
                <th key={m} className="text-center py-2 px-3 font-bold uppercase tracking-wider text-[11px] text-primary">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FPV_SPEC_ROWS.map(row => (
              <tr key={row.key} className="border-t border-outline-variant/50">
                <td className="px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-on-surface-variant align-top">{specLabel(lang, row.key)}</td>
                {row.shared ? (
                  <td className="px-3 py-2 text-on-surface text-center italic" colSpan={FPV_MODELS.length}>
                    {row.values[FPV_MODELS[0]]}
                  </td>
                ) : (
                  FPV_MODELS.map(m => (
                    <td key={m} className="px-3 py-2 text-on-surface text-center">{row.values[m]}</td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
