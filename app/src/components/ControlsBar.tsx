import type { Lang } from '@/types';
import type { PricingParams } from '@/data/pricing';
import { ts } from '@/data/i18n';
import { NumberInput } from './NumberInput';

interface Props {
  lang: Lang;
  pricing: PricingParams;
  onPricingChange: (p: PricingParams) => void;
}

interface FieldProps {
  label: string;
  value: number;
  min: number;
  allowDecimal?: boolean;
  onChange: (n: number) => void;
  full?: boolean;
}

function Field({ label, value, min, allowDecimal, onChange, full }: FieldProps) {
  return (
    <div className={'flex flex-col gap-1 ' + (full ? 'col-span-2 md:col-span-1' : '')}>
      <label className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">{label}</label>
      <div className="bg-surface-container-lowest rounded-lg px-3 py-1.5 border border-outline-variant flex items-center h-full">
        <NumberInput
          value={value}
          min={min}
          allowDecimal={allowDecimal}
          onChange={onChange}
          ariaLabel={label}
          className="w-full bg-transparent text-xs text-on-surface font-medium border-0 focus:outline-none focus:ring-0 p-0"
        />
      </div>
    </div>
  );
}

export function ControlsBar({ lang, pricing, onPricingChange }: Props) {
  return (
    <section className="bg-surface-container-low rounded-xl p-4 border border-outline-variant mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Field
          label={ts(lang, 'rate')}
          value={pricing.rate}
          min={0.01}
          allowDecimal
          onChange={n => onPricingChange({ ...pricing, rate: n })}
        />
        <Field
          label={ts(lang, 'fob')}
          value={pricing.fobK}
          min={0.01}
          allowDecimal
          onChange={n => onPricingChange({ ...pricing, fobK: n })}
        />
        <Field
          label={ts(lang, 'xkm')}
          value={pricing.xkm}
          min={1}
          onChange={n => onPricingChange({ ...pricing, xkm: n })}
          full
        />
      </div>
    </section>
  );
}
