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
    <div className="tier-row">
      {labels.map((label, i) => (
        <button
          key={i}
          className={`tier-btn${tier === i ? ' active' : ''}`}
          onClick={() => onTierChange(i as Tier)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
