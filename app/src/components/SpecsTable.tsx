import type { Lang } from '@/types';
import { FPV_MODELS, FPV_SPEC_ROWS, specLabel } from '@/data/specs';

interface Props { lang: Lang; }

export function SpecsTable({ lang }: Props) {
  return (
    <div className="specs-wrap">
      <table className="specs-table">
        <thead>
          <tr>
            <th />
            {FPV_MODELS.map(m => (
              <th key={m} className="specs-model">{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FPV_SPEC_ROWS.map(row => (
            <tr key={row.key}>
              <td className="specs-label">{specLabel(lang, row.key)}</td>
              {row.shared ? (
                <td className="specs-value specs-shared" colSpan={FPV_MODELS.length}>
                  {row.values[FPV_MODELS[0]]}
                </td>
              ) : (
                FPV_MODELS.map(m => (
                  <td key={m} className="specs-value">{row.values[m]}</td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
