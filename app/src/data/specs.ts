import type { Lang } from '@/types';

type ModelKey = 'F10' | 'F13' | 'F15';
type SpecKey =
  | 'size' | 'weight' | 'fcEsc' | 'camera' | 'ai'
  | 'vtx' | 'motor' | 'prop' | 'rx' | 'battery'
  | 'vtxDist' | 'maxSpeed' | 'rated' | 'maxLoad' | 'enduranceEmpty' | 'hoverLoaded';

interface SpecRow {
  key: SpecKey;
  values: Record<ModelKey, string>;
  /** If true, value is the same across all models — render once, spanning columns */
  shared?: boolean;
}

export const FPV_MODELS: ModelKey[] = ['F10', 'F13', 'F15'];

export const FPV_SPEC_ROWS: SpecRow[] = [
  { key: 'size', values: { F10: '380×310×60 mm', F13: '445×445×30 mm', F15: '485×485×30 mm' } },
  { key: 'weight', values: { F10: '950 g', F13: '1500 g', F15: '1670 g' } },
  { key: 'fcEsc', values: { F10: 'F405 · 60A ESC', F13: 'F405 · 80A ESC', F15: 'F405 · 100A ESC' } },
  { key: 'motor', values: { F10: '3115 · 900KV', F13: '4214 · 440KV', F15: '4315 · 375KV' } },
  { key: 'prop', values: { F10: '10×5×3', F13: '13×10×3', F15: '15×7×3' } },
  { key: 'vtx', values: { F10: '5.8G 3W VTX', F13: '5.8G 4W VTX', F15: '5.8G 4W VTX' } },
  { key: 'rx', values: { F10: 'ELRS 915', F13: 'ELRS 915', F15: 'ELRS 915' } },
  { key: 'battery', values: { F10: '6S 8 000 mAh · 1.2 kg', F13: '8S 12 000 mAh · 2.1 kg', F15: '8S 16 000 mAh · 2.6 kg' } },
  { key: 'vtxDist', values: { F10: '10 km', F13: '15 km', F15: '15 km' } },
  { key: 'maxSpeed', values: { F10: '140 km/h', F13: '150 km/h', F15: '170 km/h' } },
  { key: 'rated', values: { F10: '2.5 kg', F13: '4 kg', F15: '7 kg' } },
  { key: 'maxLoad', values: { F10: '3 kg', F13: '5 kg', F15: '8 kg' } },
  { key: 'enduranceEmpty', values: { F10: '38 min', F13: '40 min', F15: '60 min' } },
  { key: 'hoverLoaded', values: { F10: '11 min @ 2.5 kg', F13: '10 min @ 5 kg', F15: '10 min @ 8 kg' } },
  { key: 'camera', shared: true, values: { F10: 'F1.0 · 1200TVL · Super HDR · starlight night vision', F13: '', F15: '' } },
  { key: 'ai', shared: true, values: { F10: 'Vehicle 1200 m · Person 500 m · 50 targets · 6T NPU · trajectory + feature tracking', F13: '', F15: '' } },
];

type Labels = Record<SpecKey, string>;
const labelMap: Record<Lang, Labels> = {
  ru: {
    size: 'Размер (без винтов)', weight: 'Вес (без батареи)',
    fcEsc: 'FC / ESC', camera: 'Камера', ai: 'AI-модуль (опция)',
    vtx: 'Видеопередатчик', motor: 'Мотор', prop: 'Пропеллер', rx: 'Приёмник',
    battery: 'Батарея / вес',
    vtxDist: 'Дальность видео', maxSpeed: 'Макс. скорость',
    rated: 'Номинальная нагрузка', maxLoad: 'Макс. нагрузка',
    enduranceEmpty: 'Полёт без нагрузки', hoverLoaded: 'Зависание под нагрузкой',
  },
  en: {
    size: 'Size (excl. blades)', weight: 'Weight (excl. battery)',
    fcEsc: 'FC / ESC', camera: 'Camera', ai: 'AI module (optional)',
    vtx: 'Video transmitter', motor: 'Motor', prop: 'Propeller', rx: 'Receiver',
    battery: 'Battery / weight',
    vtxDist: 'Video range', maxSpeed: 'Max speed',
    rated: 'Rated load', maxLoad: 'Max load',
    enduranceEmpty: 'Endurance (empty)', hoverLoaded: 'Hover (loaded)',
  },
  zh: {
    size: '尺寸 (不含桨叶)', weight: '重量 (不含电池)',
    fcEsc: '飞控 / 电调', camera: '摄像头', ai: 'AI模块 (选配)',
    vtx: '图传', motor: '电机', prop: '螺旋桨', rx: '接收机',
    battery: '电池 / 重量',
    vtxDist: '图传距离', maxSpeed: '最大飞行速度',
    rated: '额定载荷', maxLoad: '最大载荷',
    enduranceEmpty: '空载续航', hoverLoaded: '载重悬停',
  },
};

export function specLabel(lang: Lang, key: SpecKey): string {
  return labelMap[lang][key];
}
