export type Lang = 'ru' | 'en' | 'zh';
export type Tier = 0 | 1 | 2;

export type TagType = 'ai' | 'v2' | 'top';

export interface TierPrices {
  sample: number;
  k1: number;
  k5: number;
}

export interface ComponentItem {
  id: string;
  name: string;
  sub: string;
  prices: TierPrices | null;
  default?: boolean;
  incl?: boolean;
  tbd?: boolean;
  tag?: TagType;
  dynamic?: boolean;
  /** When this camera is selected, the VTX section is hidden (camera has built-in TX) */
  includesVtx?: boolean;
  /** When this camera is selected, AI modules are incompatible */
  blocksAi?: boolean;
}

export interface ComponentSection {
  key: string;
  titleKey: string;
  type: 'radio' | 'check';
  items: ComponentItem[];
}

export interface DroneVersion {
  id: string;
  name: string;
  sub: string;
  prices: TierPrices;
}

export interface DroneModel {
  id: string;
  label: string;
  size: string;
  sub: string;
  versions: DroneVersion[];
  components: ComponentSection[];
}

export interface ConfigSelections {
  [componentId: string]: boolean | string;
  version: string;
}

export interface UserConfig {
  id: number;
  modelQtys: Record<string, number>;
  selections: Record<string, ConfigSelections>;
}

export interface SummaryItem {
  name: string;
  qty: number;
  price: number;
}

export interface SummaryGroup {
  groupLabel: string;
  configId: number;
  items: SummaryItem[];
  total: number;
}
