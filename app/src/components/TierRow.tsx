import type { Lang, Tier } from '@/types';
import { ta } from '@/data/i18n';

interface Props {
  lang: Lang;
  tier: Tier;
  onTierChange: (tier: Tier) => void;
}

export function TierRow({ lang, tier, onTierChange }: Props) {
  const labels = ta(lang, 'tiers');
  return (
    <section className="mb-6">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {labels.map((label, i) => {
          const active = tier === i;
          return (
            <button
              key={i}
              onClick={() => onTierChange(i as Tier)}
              className={
                'whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ' +
                (active
                  ? 'border-primary bg-primary text-on-primary shadow-sm'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary')
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
