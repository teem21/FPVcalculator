import type { Lang } from '@/types';
import type { PricingParams } from '@/data/pricing';
import { ts } from '@/data/i18n';

interface Props {
  lang: Lang;
  pricing: PricingParams;
  onPricingChange: (p: PricingParams) => void;
}

export function ControlsBar({ lang, pricing, onPricingChange }: Props) {
  const update = (field: keyof PricingParams, val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      onPricingChange({ ...pricing, [field]: n });
    }
  };

  return (
    <div className="controls-bar">
      <div className="ctrl-field">
        <label>{ts(lang, 'rate')}</label>
        <input
          type="number"
          value={pricing.rate}
          step="0.01"
          min="1"
          onChange={e => update('rate', e.target.value)}
        />
      </div>
      <div className="ctrl-sep" />
      <div className="ctrl-field">
        <label>{ts(lang, 'fob')}</label>
        <input
          type="number"
          value={pricing.fobK}
          step="0.01"
          min="1"
          onChange={e => update('fobK', e.target.value)}
        />
      </div>
      <div className="ctrl-sep" />
      <div className="ctrl-field">
        <label>{ts(lang, 'xkm')}</label>
        <input
          type="number"
          value={pricing.xkm}
          step="1"
          min="1"
          onChange={e => update('xkm', e.target.value)}
        />
      </div>
    </div>
  );
}
