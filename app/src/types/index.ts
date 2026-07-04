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
  /** Optional product photo shown as a thumbnail (path under /public). */
  img?: string;
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
  groundQtys: Record<string, number>;
}

export type SummaryGroupKey = 'drone' | 'components' | 'ground' | 'antennas';

export interface SummaryItem {
  name: string;
  sub?: string;
  qty: number;
  unitPrice: number;
  price: number;
  group: SummaryGroupKey;
}

/** One "category → chosen option" row of a drone build sheet. */
export interface BuildRow {
  label: string;
  value: string;
  sub?: string;
  price: number | null;
  incl?: boolean;
  tbd?: boolean;
}

export interface SummaryGroup {
  groupLabel: string;
  configId: number;
  items: SummaryItem[];
  total: number;
  droneCount: number;
  /** Drone build sheet (frame, FC, camera, …) for the panel display. */
  build?: BuildRow[];
  droneImg?: string;
  droneTitle?: string;
}
