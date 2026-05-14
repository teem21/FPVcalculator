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
    groundSub: 'Количество указывается отдельно для каждой позиции',
    antennas: '📡 Антенны',
    antennasSub: 'Количество указывается отдельно для каждой антенны',
    cfg: 'Конфиг', export: '⬇ Скачать XLSX',
    saveCfg: '✓ Сохранить конфигурацию',
    tabOverview: 'Обзор', tabConfigs: 'Конфигурации', tabOrder: 'Заказ', tabContact: 'Контакты',
    overviewTitle: 'О платформе',
    overviewBody: 'FPV Configurator — инструмент для расчёта стоимости FPV-дронов под ваши задачи. Выберите модель, комплектующие, антенны и наземное оборудование — итоговая цена пересчитывается автоматически с учётом курса USD/CNY, FOB-наценки и количества (sample / 1k+ / 5k+). Готовый заказ можно выгрузить в XLSX.',
    contactTitle: 'Связаться с нами',
    contactBody: 'Напишите нам, чтобы уточнить характеристики, обсудить кастомизацию или получить инвойс.',
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
    groundSub: 'Quantity is set independently for each item',
    antennas: '📡 Antennas',
    antennasSub: 'Quantity is set independently for each antenna',
    cfg: 'Config', export: '⬇ Download XLSX',
    saveCfg: '✓ Save configuration',
    tabOverview: 'Overview', tabConfigs: 'Configurations', tabOrder: 'Order', tabContact: 'Contact',
    overviewTitle: 'About the platform',
    overviewBody: 'FPV Configurator is a tool for pricing FPV drones for your missions. Pick a model, components, antennas and ground equipment — totals recalculate automatically based on USD/CNY rate, FOB margin and tier (sample / 1k+ / 5k+). The final order can be exported to XLSX.',
    contactTitle: 'Contact us',
    contactBody: 'Reach out to clarify specs, discuss customization or request an invoice.',
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
    groundSub: '每项可单独设置数量',
    antennas: '📡 天线',
    antennasSub: '每根天线可单独设置数量',
    cfg: '配置', export: '⬇ 下载 XLSX',
    saveCfg: '✓ 保存配置',
    tabOverview: '概览', tabConfigs: '配置', tabOrder: '订单', tabContact: '联系',
    overviewTitle: '关于平台',
    overviewBody: 'FPV Configurator 是为您的任务定制FPV无人机价格的工具。选择型号、配件、天线和地面设备 — 价格根据USD/CNY汇率、FOB加价和数量等级（样品/1k+/5k+）自动计算。最终订单可导出为XLSX。',
    contactTitle: '联系我们',
    contactBody: '联系我们以澄清规格、讨论定制或索取发票。',
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
