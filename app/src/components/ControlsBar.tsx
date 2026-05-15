import type { Lang } from '@/types';
import type { PricingParams } from '@/data/pricing';
import { ts } from '@/data/i18n';

interface Props {
  lang: Lang;
  pricing: PricingParams;
  onPricingChange: (p: PricingParams) => void;
}

interface FieldProps {
  label: string;
  value: number;
  step: string;
  onChange: (val: string) => void;
  full?: boolean;
}

function Field({ label, value, step, onChange, full }: FieldProps) {
  return (
    <div className={'flex flex-col gap-1 ' + (full ? 'col-span-2 md:col-span-1' : '')}>
      <label className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">{label}</label>
      <div className="bg-surface-container-lowest rounded-lg px-3 py-1.5 border border-outline-variant flex items-center h-full">
        <input
          type="number"
          value={value}
          step={step}
          min="0"
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent text-xs text-on-surface font-medium border-0 focus:outline-none focus:ring-0 p-0"
        />
      </div>
    </div>
  );
}

export function ControlsBar({ lang, pricing, onPricingChange }: Props) {
  const update = (field: keyof PricingParams, val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      onPricingChange({ ...pricing, [field]: n });
    }
  };

  return (
    <section className="bg-surface-container-low rounded-xl p-4 border border-outline-variant mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Field label={ts(lang, 'rate')} value={pricing.rate} step="0.01" onChange={v => update('rate', v)} />
        <Field label={ts(lang, 'fob')} value={pricing.fobK} step="0.01" onChange={v => update('fobK', v)} />
        <Field label={ts(lang, 'xkm')} value={pricing.xkm} step="1" onChange={v => update('xkm', v)} full />
      </div>
    </section>
  );
}
