import type { Lang } from '@/types';

const translations = {
  ru: {
    title: 'Конфигуратор FPV дронов',
    sub: 'Выберите модели, комплектующие и количество — стоимость рассчитывается автоматически',
    rate: 'USD/CNY', fob: 'FOB ×', xkm: 'X CNY/км',
    tiers: ['Образец (1 шт)', 'от 1 000 шт', 'от 5 000 шт'],
    summary: 'Итог заказа', empty: 'Выберите модель\nи комплектующие',
    totalLbl: 'Итого', reset: '↺ Сбросить', addCfg: '+ Конфигурация',
    qty: 'шт', incl: 'включено', tbd: 'уточн.',
    versions: 'Версия дрона', battery: '🔋 Аккумулятор', esc: '⚡ ESC (регулятор)',
    fc: '🧠 Полётный контроллер (FC)', camera: '📷 FPV камера',
    vtx: '📡 Видеопередатчик (VTX)', rx: '📻 Приёмник (RX)',
    tx: '📤 TX-модуль', fiber_gnd: '🔌 Наземная станция (оптика)',
    fiber_len: '📏 Длина оптоволокна/шт', ai: '🤖 AI-модуль (опция)',
    ground: '🎮 Наземное оборудование',
    cfg: 'Конфиг',
  },
  en: {
    title: 'FPV Drone Configurator',
    sub: 'Select models, components and quantities — pricing is calculated automatically',
    rate: 'USD/CNY', fob: 'FOB ×', xkm: 'X CNY/km',
    tiers: ['Sample (1 pc)', 'from 1,000 pcs', 'from 5,000 pcs'],
    summary: 'Order Summary', empty: 'Select a drone model\nand components',
    totalLbl: 'Total', reset: '↺ Reset', addCfg: '+ Configuration',
    qty: 'pcs', incl: 'included', tbd: 'TBD',
    versions: 'Drone version', battery: '🔋 Battery', esc: '⚡ ESC',
    fc: '🧠 Flight controller (FC)', camera: '📷 FPV camera',
    vtx: '📡 Video transmitter (VTX)', rx: '📻 Receiver (RX)',
    tx: '📤 TX module', fiber_gnd: '🔌 Ground station (fiber)',
    fiber_len: '📏 Fiber length/unit', ai: '🤖 AI module (optional)',
    ground: '🎮 Ground equipment',
    cfg: 'Config',
  },
  zh: {
    title: 'FPV无人机配置器',
    sub: '选择机型、配件和数量 — 价格自动计算',
    rate: 'USD/CNY汇率', fob: 'FOB系数', xkm: 'X CNY/公里',
    tiers: ['样品 (1架)', '1,000架起', '5,000架起'],
    summary: '订单合计', empty: '请选择无人机型号\n和配件',
    totalLbl: '合计', reset: '↺ 重置', addCfg: '+ 新配置',
    qty: '架', incl: '已含', tbd: '待确认',
    versions: '无人机版本', battery: '🔋 电池', esc: '⚡ 电调 (ESC)',
    fc: '🧠 飞控 (FC)', camera: '📷 FPV摄像头',
    vtx: '📡 视频传输 (VTX)', rx: '📻 接收机 (RX)',
    tx: '📤 TX模块', fiber_gnd: '🔌 地面站 (光纤)',
    fiber_len: '📏 光纤长度/架', ai: '🤖 AI模块 (选配)',
    ground: '🎮 地面设备',
    cfg: '配置',
  },
} as const;

export type TranslationKey = keyof typeof translations.ru;

export function t(lang: Lang, key: TranslationKey): string | readonly string[] {
  return translations[lang][key];
}

export function ts(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] as string;
}

export function ta(lang: Lang, key: TranslationKey): readonly string[] {
  return translations[lang][key] as readonly string[];
}
