import type { Lang, Tier, DroneModel, DroneVersion, ComponentSection, ComponentItem, TierPrices } from '@/types';
import { ts } from './i18n';
import { fiberPrice, usdToCny, type PricingParams } from './pricing';

interface ModelNames {
  std: string; fib: string;
  std_sub: string; fib_sub: string;
  f10sub: string; f13sub: string; f15sub: string;
}

const modelNames: Record<Lang, ModelNames> = {
  ru: {
    std: 'Стандарт RF', fib: 'Оптоволоконная',
    std_sub: '5.8G радиоканал · ELRS 915 в комплекте', fib_sub: 'Встроенный оптоволоконный модуль',
    f10sub: 'F405 · ESC 60A · 3115 900KV · 10×5×3 · VTX 5.8G 3W · 10км/ч–140км/ч · 2.5кг',
    f13sub: 'F405 · ESC 80A · 4214 440KV · 13×10×3 · VTX 5.8G 4W · 150км/ч · 4кг',
    f15sub: 'F405 · ESC 100A · 4315 375KV · 15×7×3 · VTX 5.8G 4W · 170км/ч · 7кг',
  },
  en: {
    std: 'Standard RF', fib: 'Fiber optic',
    std_sub: '5.8G RF · ELRS 915 included', fib_sub: 'Built-in fiber optic module',
    f10sub: 'F405 · ESC 60A · 3115 900KV · 10×5×3 · VTX 5.8G 3W · max 140km/h · 2.5kg',
    f13sub: 'F405 · ESC 80A · 4214 440KV · 13×10×3 · VTX 5.8G 4W · 150km/h · 4kg',
    f15sub: 'F405 · ESC 100A · 4315 375KV · 15×7×3 · VTX 5.8G 4W · 170km/h · 7kg',
  },
  zh: {
    std: '标准RF版', fib: '光纤版',
    std_sub: '5.8G无线电 · 含ELRS 915接收机', fib_sub: '内置光纤通讯模块',
    f10sub: 'F405飞控 · ESC 60A · 3115 900KV · 10×5×3 · VTX 5.8G 3W · 最高140km/h · 负载2.5kg',
    f13sub: 'F405飞控 · ESC 80A · 4214 440KV · 13×10×3 · VTX 5.8G 4W · 150km/h · 负载4kg',
    f15sub: 'F405飞控 · ESC 100A · 4315 375KV · 15×7×3 · VTX 5.8G 4W · 170km/h · 负载7kg',
  },
};

type CompNameKey =
  | 'bat6' | 'bat8_12' | 'bat8_16'
  | 'esc60' | 'esc80' | 'esc100'
  | 'fc_std' | 'fc_f722'
  | 'cam_std' | 'cam_n2' | 'cam_n2p'
  | 'cam_dji_o4'
  | 'q4max_opt_d' | 'q4max_opt_dg' | 'q4max_ir_d' | 'q4max_ir_dg'
  | 'vtx_rf3' | 'vtx_rf4'
  | 'rx_std' | 'rx_gem'
  | 'tx_none' | 'tx_nano'
  | 'fib_no' | 'gnd40' | 'gnd80'
  | 'fib_0' | 'fib_5' | 'fib_10' | 'fib_20' | 'fib_30'
  | 'ai_no' | 'ai1' | 'ai2' | 'ai3' | 'ai4' | 'ai5'
  | 'rc' | 'goggb' | 'gogbc' | 'ant' | 'chr6' | 'chr8';

const compNames: Record<Lang, Record<CompNameKey, string>> = {
  ru: {
    bat6: '6S 8 000 мАч', bat8_12: '8S 12 000 мАч', bat8_16: '8S 16 000 мАч',
    esc60: '60A 4-в-1 (6S)', esc80: '80A 4-в-1 (6S)', esc100: '100A 4-в-1 (8S)',
    fc_std: 'F405 (штатный)', fc_f722: 'F722 PRO V2',
    cam_std: '1200TVL F1.0 (штатная)', cam_n2: 'N2 Pro (ночная)', cam_n2p: 'N2 Pro+ (ночная+)',
    cam_dji_o4: 'DJI O4 Air Unit Pro',
    q4max_opt_d: 'Q4Max (оптика) · модуль дрона', q4max_opt_dg: 'Q4Max (оптика) · дрон + земля',
    q4max_ir_d: 'Q4Max (ИК) · модуль дрона', q4max_ir_dg: 'Q4Max (ИК) · дрон + земля',
    vtx_rf3: '5.8G 3W VTX (штатный)', vtx_rf4: '5.8G 4W VTX (штатный)',
    rx_std: 'ELRS 915MHz (штатный)', rx_gem: 'BAYCKRC Gemini 900/2400MHz',
    tx_none: 'Не нужен', tx_nano: 'BAYCKRC NANO GEMINI ELRS',
    fib_no: 'Без наземной станции', gnd40: 'Наземная станция 40км', gnd80: 'Наземная станция 80км',
    fib_0: 'Без волокна (RF)', fib_5: '5 км', fib_10: '10 км', fib_20: '20 км', fib_30: '30 км',
    ai_no: 'Без AI', ai1: 'Базовый — одна видеокамера', ai2: 'Расширенный — двойная видеокамера',
    ai3: 'Тепловизор 384 — видео + тепло', ai4: 'Предтоп — двойная + тепловизор 384',
    ai5: 'ТОП ★ — двойная + тепловизор 640',
    rc: 'Пульт RadioMaster TX12 Mark II', goggb: 'FPV-очки базовые 5.8G',
    gogbc: 'SKYZONE Cobra X V4', ant: 'Комплект антенн (6 штук)',
    chr6: 'Зарядник 6S', chr8: 'Зарядник 8S',
  },
  en: {
    bat6: '6S 8,000 mAh', bat8_12: '8S 12,000 mAh', bat8_16: '8S 16,000 mAh',
    esc60: '60A 4-in-1 (6S)', esc80: '80A 4-in-1 (6S)', esc100: '100A 4-in-1 (8S)',
    fc_std: 'F405 (standard)', fc_f722: 'F722 PRO V2',
    cam_std: '1200TVL F1.0 (standard)', cam_n2: 'N2 Pro (night)', cam_n2p: 'N2 Pro+ (night+)',
    cam_dji_o4: 'DJI O4 Air Unit Pro',
    q4max_opt_d: 'Q4Max (optical) · drone module', q4max_opt_dg: 'Q4Max (optical) · drone + ground',
    q4max_ir_d: 'Q4Max (IR) · drone module', q4max_ir_dg: 'Q4Max (IR) · drone + ground',
    vtx_rf3: '5.8G 3W VTX (standard)', vtx_rf4: '5.8G 4W VTX (standard)',
    rx_std: 'ELRS 915MHz (standard)', rx_gem: 'BAYCKRC Gemini 900/2400MHz',
    tx_none: 'Not needed', tx_nano: 'BAYCKRC NANO GEMINI ELRS',
    fib_no: 'No ground station', gnd40: 'Ground station 40km', gnd80: 'Ground station 80km',
    fib_0: 'No fiber (RF)', fib_5: '5 km', fib_10: '10 km', fib_20: '20 km', fib_30: '30 km',
    ai_no: 'No AI', ai1: 'Basic — single camera', ai2: 'Advanced — dual camera',
    ai3: 'Thermal 384 — video + thermal', ai4: 'Pre-top — dual + thermal 384',
    ai5: 'TOP ★ — dual + thermal 640',
    rc: 'RadioMaster TX12 Mark II', goggb: 'Basic FPV goggles 5.8G',
    gogbc: 'SKYZONE Cobra X V4', ant: 'Antenna kit (6 antennas)',
    chr6: '6S charger', chr8: '8S charger',
  },
  zh: {
    bat6: '6S 8000mAh电池', bat8_12: '8S 12000mAh电池', bat8_16: '8S 16000mAh电池',
    esc60: '60A四合一电调(6S)', esc80: '80A四合一电调(6S)', esc100: '100A四合一电调(8S)',
    fc_std: 'F405飞控（标准）', fc_f722: 'F722 PRO V2飞控',
    cam_std: '1200TVL F1.0摄像头（标准）', cam_n2: 'N2 Pro夜视摄像头', cam_n2p: 'N2 Pro+夜视摄像头',
    cam_dji_o4: 'DJI O4 Air Unit Pro',
    q4max_opt_d: 'Q4Max（光学）· 机载模块', q4max_opt_dg: 'Q4Max（光学）· 机载+地面',
    q4max_ir_d: 'Q4Max（红外）· 机载模块', q4max_ir_dg: 'Q4Max（红外）· 机载+地面',
    vtx_rf3: '5.8G 3W图传（标准）', vtx_rf4: '5.8G 4W图传（标准）',
    rx_std: 'ELRS 915MHz接收机（标准）', rx_gem: 'BAYCKRC Gemini 900/2400MHz双频接收机',
    tx_none: '不需要', tx_nano: 'BAYCKRC NANO GEMINI ELRS TX模块',
    fib_no: '无地面站', gnd40: '光纤地面站 40公里', gnd80: '光纤地面站 80公里',
    fib_0: '不需要光纤（RF版）', fib_5: '5公里', fib_10: '10公里', fib_20: '20公里', fib_30: '30公里',
    ai_no: '不含AI', ai1: '基础款 — 单光学 500米', ai2: '增强款 — 双光学 1200米',
    ai3: '热成像384 — 视频+热成像', ai4: '次顶配 — 双光学+热成像384',
    ai5: '顶配★ — 双光学+热成像640',
    rc: 'RadioMaster TX12 Mark II遥控器', goggb: '基础款FPV眼镜 5.8G',
    gogbc: 'SKYZONE Cobra X V4眼镜', ant: '天线套装（6根）',
    chr6: '6S充电器', chr8: '8S充电器',
  },
};

function getCompSubs(lang: Lang, p: PricingParams): Record<CompNameKey, string> {
  const { rate: r, fobK: k, xkm } = p;
  const f722 = usdToCny(lang === 'ru' ? 26 : 26, r, k);
  const gemini = usdToCny(26.5, r, k);
  const cobra = usdToCny(220, r, k);
  const dji_o4 = usdToCny(208, r, k);
  const fib = (km: number) => `¥${fiberPrice(km, xkm, 0)}/¥${fiberPrice(km, xkm, 1)}/¥${fiberPrice(km, xkm, 2)}`;

  const subs: Record<Lang, Record<CompNameKey, string>> = {
    ru: {
      bat6: '1.2 кг · для F10', bat8_12: '2.1 кг · для F13', bat8_16: '2.6 кг · для F15',
      esc60: 'штатный', esc80: 'штатный / апгрейд', esc100: 'штатный',
      fc_std: 'включён в стоимость дрона', fc_f722: `$26(обр)/$23(1к+) × ${r.toFixed(2)} ÷ ${k} = ¥${f722}`,
      cam_std: 'Super HDR · ночное зрение · включена', cam_n2: 'превосходит Ratel 2', cam_n2p: 'превосходит Ratel Pro',
      cam_dji_o4: `камера + TX · несовм. с AI · $208 × ${r.toFixed(2)} ÷ ${k} = ¥${dji_o4}`,
      q4max_opt_d: 'антиджаммер · оптическая камера · только модуль дрона',
      q4max_opt_dg: 'антиджаммер · оптическая камера · модуль дрона + наземная станция',
      q4max_ir_d: 'антиджаммер · инфракрасная камера · только модуль дрона',
      q4max_ir_dg: 'антиджаммер · инфракрасная камера · модуль дрона + наземная станция',
      vtx_rf3: 'включён в стандартную версию', vtx_rf4: 'включён в стандартную версию',
      rx_std: 'включён в стандартную версию', rx_gem: `$26.5 × ${r.toFixed(2)} ÷ ${k} = ¥${gemini} · двухдиапазонный`,
      tx_none: 'модуль пульта встроен', tx_nano: 'dual TX 900/2400МГц 1W · адаптер Nano→Micro-JR · SMA×2',
      fib_no: '', gnd40: '光纤地面端40km-加强版（含电池）', gnd80: '光纤地面端80km-加强版',
      fib_0: '', fib_5: fib(5), fib_10: fib(10), fib_20: fib(20), fib_30: fib(30),
      ai_no: '', ai1: 'авто 500м · 50 целей · 6T', ai2: 'авто 1200м · человек 500м · 50 целей · 6T',
      ai3: 'одна камера + тепловизор 384', ai4: 'двойная + тепловизор 384', ai5: 'двойная + тепловизор 640 · максимум',
      rc: 'ELRS FCC EdgeTX', goggb: '5.8G стандартные очки',
      gogbc: `$220 × ${r.toFixed(2)} ÷ ${k} = ¥${cobra} · DVR · Diversity · Steadyview`,
      ant: 'Mushroom×2 · Patch×2 · Moxon900×1 · Moxon2400×1 · Maple×1 · Helical×1',
      chr6: 'HOTA D6 Pro · для F10', chr8: 'для F13 / F15',
    },
    en: {
      bat6: '1.2 kg · for F10', bat8_12: '2.1 kg · for F13', bat8_16: '2.6 kg · for F15',
      esc60: 'standard', esc80: 'standard / upgrade', esc100: 'standard',
      fc_std: 'included in drone price', fc_f722: `$26(sample)/$23(1k+) × ${r.toFixed(2)} ÷ ${k} = ¥${f722}`,
      cam_std: 'Super HDR · night vision · included', cam_n2: 'better than Ratel 2', cam_n2p: 'better than Ratel Pro',
      cam_dji_o4: `camera + TX · AI incompatible · $208 × ${r.toFixed(2)} ÷ ${k} = ¥${dji_o4}`,
      q4max_opt_d: 'anti-jam · optical camera · drone module only',
      q4max_opt_dg: 'anti-jam · optical camera · drone module + ground station',
      q4max_ir_d: 'anti-jam · IR camera · drone module only',
      q4max_ir_dg: 'anti-jam · IR camera · drone module + ground station',
      vtx_rf3: 'included in standard version', vtx_rf4: 'included in standard version',
      rx_std: 'included in standard version', rx_gem: `$26.5 × ${r.toFixed(2)} ÷ ${k} = ¥${gemini} · dual-band`,
      tx_none: 'transmitter module built in', tx_nano: 'dual TX 900/2400MHz 1W · Nano→Micro-JR adapter · SMA×2',
      fib_no: '', gnd40: '光纤地面端40km-加强版（含电池）', gnd80: '光纤地面端80km-加强版',
      fib_0: '', fib_5: fib(5), fib_10: fib(10), fib_20: fib(20), fib_30: fib(30),
      ai_no: '', ai1: 'vehicle 500m · 50 targets · 6T', ai2: 'vehicle 1200m · person 500m · 50 targets · 6T',
      ai3: 'single cam + thermal 384', ai4: 'dual cam + thermal 384', ai5: 'dual cam + thermal 640 · maximum',
      rc: 'ELRS FCC EdgeTX', goggb: '5.8G standard goggles',
      gogbc: `$220 × ${r.toFixed(2)} ÷ ${k} = ¥${cobra} · DVR · Diversity · Steadyview`,
      ant: 'Mushroom×2 · Patch×2 · Moxon900×1 · Moxon2400×1 · Maple×1 · Helical×1',
      chr6: 'HOTA D6 Pro · for F10', chr8: 'for F13 / F15',
    },
    zh: {
      bat6: '1.2千克 · F10用', bat8_12: '2.1千克 · F13用', bat8_16: '2.6千克 · F15用',
      esc60: '标准款', esc80: '标准款/升级款', esc100: '标准款',
      fc_std: '含在无人机价格中', fc_f722: `$26(样品)/$23(1000+架) × ${r.toFixed(2)} ÷ ${k} = ¥${f722}`,
      cam_std: '超级HDR · 夜视 · 已含', cam_n2: '优于Ratel 2', cam_n2p: '优于Ratel Pro',
      cam_dji_o4: `摄像头+图传 · 与AI不兼容 · $208 × ${r.toFixed(2)} ÷ ${k} = ¥${dji_o4}`,
      q4max_opt_d: '抗干扰 · 光学摄像头 · 仅机载模块',
      q4max_opt_dg: '抗干扰 · 光学摄像头 · 机载模块+地面站',
      q4max_ir_d: '抗干扰 · 红外摄像头 · 仅机载模块',
      q4max_ir_dg: '抗干扰 · 红外摄像头 · 机载模块+地面站',
      vtx_rf3: '含在标准版中', vtx_rf4: '含在标准版中',
      rx_std: '含在标准版中', rx_gem: `$26.5 × ${r.toFixed(2)} ÷ ${k} = ¥${gemini} · 双频`,
      tx_none: '遥控器自带发射模块', tx_nano: '双发900/2400MHz 1W · Nano→Micro-JR适配器 · SMA天线×2',
      fib_no: '', gnd40: '光纤地面端40km-加强版（含电池）', gnd80: '光纤地面端80km-加强版',
      fib_0: '', fib_5: fib(5), fib_10: fib(10), fib_20: fib(20), fib_30: fib(30),
      ai_no: '', ai1: '识别车辆500米 · 50目标 · 算力6T', ai2: '识别车辆1200米 · 人员500米 · 50目标 · 6T',
      ai3: '单摄像头+热成像384', ai4: '双摄像头+热成像384', ai5: '双摄像头+热成像640 · 顶配',
      rc: 'ELRS FCC EdgeTX', goggb: '基础款5.8G眼镜',
      gogbc: `$220 × ${r.toFixed(2)} ÷ ${k} = ¥${cobra} · DVR · 分集接收 · Steadyview`,
      ant: '蘑菇×2 · 贴片×2 · Moxon900×1 · Moxon2400×1 · Maple×1 · 螺旋×1',
      chr6: 'HOTA D6 Pro · F10用', chr8: 'F13/F15用',
    },
  };
  return subs[lang];
}

function buildComponents(
  modelId: string,
  lang: Lang,
  pricing: PricingParams,
): ComponentSection[] {
  const cn = compNames[lang];
  const cs = getCompSubs(lang, pricing);
  const { rate: r, fobK: k, xkm } = pricing;

  const f722price = usdToCny(26, r, k);
  const f722price_bulk = usdToCny(23, r, k);
  const geminiPrice = usdToCny(26.5, r, k);
  const cobraPrice = usdToCny(220, r, k);
  const djiPrice = usdToCny(208, r, k);

  const is10 = modelId === 'F10';
  const is13 = modelId === 'F13';
  const is15 = modelId === 'F15';

  const sections: ComponentSection[] = [];

  // Battery
  const bats: ComponentItem[] = [];
  if (is10) bats.push({ id: 'bat6', name: cn.bat6, sub: cs.bat6, prices: tp(350, 300, 280), default: true });
  if (is13) bats.push({ id: 'bat8_12', name: cn.bat8_12, sub: cs.bat8_12, prices: tp(580, 530, 510), default: true });
  if (is15) bats.push({ id: 'bat8_16', name: cn.bat8_16, sub: cs.bat8_16, prices: tp(750, 680, 650), default: true });
  sections.push({ key: 'battery', titleKey: 'battery', type: 'radio', items: bats });

  // ESC
  const escs: ComponentItem[] = [];
  if (is10) {
    escs.push({ id: 'esc60', name: cn.esc60, sub: cs.esc60, prices: null, tbd: true, default: true });
    escs.push({ id: 'esc80', name: cn.esc80, sub: cs.esc80, prices: tp(245, 200, 160) });
  }
  if (is13) escs.push({ id: 'esc80', name: cn.esc80, sub: cs.esc80, prices: tp(245, 200, 160), default: true });
  if (is15) escs.push({ id: 'esc100', name: cn.esc100, sub: cs.esc100, prices: tp(300, 230, 210), default: true });
  sections.push({ key: 'esc', titleKey: 'esc', type: 'radio', items: escs });

  // FC (F10 only)
  if (is10) {
    const f722p = f722price;
    sections.push({
      key: 'fc', titleKey: 'fc', type: 'radio', items: [
        { id: 'fc_std', name: cn.fc_std, sub: cs.fc_std, prices: null, incl: true, default: true },
        { id: 'fc_f722', name: cn.fc_f722, sub: cs.fc_f722, prices: tp(f722p, f722price_bulk, f722price_bulk), tag: 'v2' },
      ],
    });
  }

  // Camera
  sections.push({
    key: 'camera', titleKey: 'camera', type: 'radio', items: [
      { id: 'cam_std', name: cn.cam_std, sub: cs.cam_std, prices: null, incl: true, default: true },
      { id: 'cam_n2', name: cn.cam_n2, sub: cs.cam_n2, prices: tp(160, 135, 120) },
      { id: 'cam_n2p', name: cn.cam_n2p, sub: cs.cam_n2p, prices: tp(180, 150, 135) },
      // camera+TX combos — VTX section hidden when selected; DJI also blocks AI
      { id: 'cam_dji_o4', name: cn.cam_dji_o4, sub: cs.cam_dji_o4, prices: tp(djiPrice, djiPrice, djiPrice), includesVtx: true, blocksAi: true },
      { id: 'q4max_opt_d', name: cn.q4max_opt_d, sub: cs.q4max_opt_d, prices: tp(2150, 2150, 2150), includesVtx: true },
      { id: 'q4max_opt_dg', name: cn.q4max_opt_dg, sub: cs.q4max_opt_dg, prices: tp(2850, 2850, 2850), includesVtx: true },
      { id: 'q4max_ir_d', name: cn.q4max_ir_d, sub: cs.q4max_ir_d, prices: null, tbd: true, includesVtx: true },
      { id: 'q4max_ir_dg', name: cn.q4max_ir_dg, sub: cs.q4max_ir_dg, prices: null, tbd: true, includesVtx: true },
    ],
  });

  // VTX — only standard; hidden by ModelCard when a camera with built-in TX is selected
  const vtxItems: ComponentItem[] = [];
  if (is10) vtxItems.push({ id: 'vtx_rf3', name: cn.vtx_rf3, sub: cs.vtx_rf3, prices: null, incl: true, default: true });
  else vtxItems.push({ id: 'vtx_rf4', name: cn.vtx_rf4, sub: cs.vtx_rf4, prices: null, incl: true, default: true });
  sections.push({ key: 'vtx', titleKey: 'vtx', type: 'radio', items: vtxItems });

  // RX
  const rxItems: ComponentItem[] = [
    { id: 'rx_std', name: cn.rx_std, sub: cs.rx_std, prices: null, incl: true, default: true },
  ];
  if (is10) rxItems.push({ id: 'rx_gem', name: cn.rx_gem, sub: cs.rx_gem, prices: tp(geminiPrice, geminiPrice, geminiPrice), tag: 'v2' });
  sections.push({ key: 'rx', titleKey: 'rx', type: 'radio', items: rxItems });

  // TX (F10 only)
  if (is10) {
    sections.push({
      key: 'tx', titleKey: 'tx', type: 'radio', items: [
        { id: 'tx_none', name: cn.tx_none, sub: cs.tx_none, prices: null, incl: true, default: true },
        { id: 'tx_nano', name: cn.tx_nano, sub: cs.tx_nano, prices: tp(326, 326, 326), tag: 'v2' },
      ],
    });
  }

  // Fiber ground station
  sections.push({
    key: 'fib_gnd', titleKey: 'fiber_gnd', type: 'radio', items: [
      { id: 'fib_no', name: cn.fib_no, sub: cs.fib_no, prices: null, incl: true, default: true },
      { id: 'gnd40', name: cn.gnd40, sub: cs.gnd40, prices: tp(330, 300, 270) },
      { id: 'gnd80', name: cn.gnd80, sub: cs.gnd80, prices: tp(400, 370, 340) },
    ],
  });

  // Fiber length
  sections.push({
    key: 'fib_len', titleKey: 'fiber_len', type: 'radio', items: [
      { id: 'fib_0', name: cn.fib_0, sub: '', prices: null, incl: true, default: true },
      { id: 'fib_5', name: cn.fib_5, sub: cs.fib_5, prices: tp(fiberPrice(5, xkm, 0), fiberPrice(5, xkm, 1), fiberPrice(5, xkm, 2)), dynamic: true },
      { id: 'fib_10', name: cn.fib_10, sub: cs.fib_10, prices: tp(fiberPrice(10, xkm, 0), fiberPrice(10, xkm, 1), fiberPrice(10, xkm, 2)), dynamic: true },
      { id: 'fib_20', name: cn.fib_20, sub: cs.fib_20, prices: tp(fiberPrice(20, xkm, 0), fiberPrice(20, xkm, 1), fiberPrice(20, xkm, 2)), dynamic: true },
      { id: 'fib_30', name: cn.fib_30, sub: cs.fib_30, prices: tp(fiberPrice(30, xkm, 0), fiberPrice(30, xkm, 1), fiberPrice(30, xkm, 2)), dynamic: true },
    ],
  });

  // AI
  sections.push({
    key: 'ai', titleKey: 'ai', type: 'radio', items: [
      { id: 'ai_no', name: cn.ai_no, sub: '', prices: null, incl: true, default: true },
      { id: 'ai1', name: cn.ai1, sub: cs.ai1, prices: tp(1300, 1200, 1100), tag: 'ai' },
      { id: 'ai2', name: cn.ai2, sub: cs.ai2, prices: tp(1850, 1800, 1750), tag: 'ai' },
      { id: 'ai3', name: cn.ai3, sub: cs.ai3, prices: tp(3250, 3150, 3000), tag: 'ai' },
      { id: 'ai4', name: cn.ai4, sub: cs.ai4, prices: tp(4250, 4050, 3900), tag: 'ai' },
      { id: 'ai5', name: cn.ai5, sub: cs.ai5, prices: tp(5200, 5100, 4800), tag: 'top' },
    ],
  });

  return sections;
}

export function getGroundItems(lang: Lang, pricing: PricingParams): ComponentItem[] {
  const cn = compNames[lang];
  const cs = getCompSubs(lang, pricing);
  const { rate: r, fobK: k } = pricing;
  const cobraPrice = usdToCny(220, r, k);

  return [
    { id: 'rc', name: cn.rc, sub: cs.rc, prices: tp(650, 600, 580) },
    { id: 'goggb', name: cn.goggb, sub: cs.goggb, prices: tp(420, 400, 380) },
    { id: 'gogbc', name: cn.gogbc, sub: cs.gogbc, prices: tp(cobraPrice, cobraPrice, cobraPrice), tag: 'v2' },
    { id: 'ant', name: cn.ant, sub: cs.ant, prices: tp(471, 471, 471), tag: 'v2' },
    { id: 'chr6', name: cn.chr6, sub: cs.chr6, prices: tp(350, 300, 280) },
    { id: 'chr8', name: cn.chr8, sub: cs.chr8, prices: tp(550, 500, 450) },
  ];
}

export function getModels(lang: Lang, pricing: PricingParams): DroneModel[] {
  const n = modelNames[lang];

  const defs: Array<{ id: string; label: string; size: string; sub: string; versions: DroneVersion[] }> = [
    {
      id: 'F10', label: 'F10', size: '10"', sub: n.f10sub,
      versions: [
        { id: 'f10_rf', name: n.std, sub: n.std_sub, prices: tp(1480, 1180, 1080) },
        { id: 'f10_fib', name: n.fib, sub: n.fib_sub, prices: tp(1280, 980, 880) },
      ],
    },
    {
      id: 'F13', label: 'F13', size: '13"', sub: n.f13sub,
      versions: [
        { id: 'f13_rf', name: n.std, sub: n.std_sub, prices: tp(2000, 1700, 1600) },
        { id: 'f13_fib', name: n.fib, sub: n.fib_sub, prices: tp(1700, 1400, 1300) },
      ],
    },
    {
      id: 'F15', label: 'F15', size: '15"', sub: n.f15sub,
      versions: [
        { id: 'f15_rf', name: n.std, sub: n.std_sub, prices: tp(2100, 1900, 1800) },
        { id: 'f15_fib', name: n.fib, sub: n.fib_sub, prices: tp(1900, 1600, 1500) },
      ],
    },
  ];

  return defs.map(d => ({
    ...d,
    components: buildComponents(d.id, lang, pricing),
  }));
}

function tp(sample: number, k1: number, k5: number): TierPrices {
  return { sample, k1, k5 };
}
