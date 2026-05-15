import ExcelJS from 'exceljs';
import type { Lang, Tier, SummaryGroup, SummaryGroupKey, SummaryItem } from '@/types';
import type { PricingParams } from './pricing';

const TIER_LABELS: Record<Tier, Record<Lang, string>> = {
  0: { ru: 'Образец', en: 'Sample Tier', zh: '样品' },
  1: { ru: 'от 1 000 шт', en: 'From 1,000 pcs', zh: '1000件起' },
  2: { ru: 'от 5 000 шт', en: 'From 5,000 pcs', zh: '5000件起' },
};

const COL_HEADERS: Record<Lang, [string, string, string, string, string, string, string]> = {
  ru: ['#', 'Наименование', 'Характеристики', 'Кол-во', 'Цена (CNY)', 'Сумма (CNY)', 'Сумма (USD)'],
  en: ['#', 'Item', 'Specification', 'Qty', 'Price (CNY)', 'Total (CNY)', 'Total (USD)'],
  zh: ['#', '名称', '规格', '数量', '单价 (CNY)', '总价 (CNY)', '总价 (USD)'],
};

const TITLE: Record<Lang, string> = {
  ru: 'AGR Hangzhou (启飞智能)  ·  КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ  ·  FPV DRONE SYSTEM',
  en: 'AGR Hangzhou (启飞智能)  ·  COMMERCIAL PROPOSAL  ·  FPV DRONE SYSTEM',
  zh: 'AGR Hangzhou (启飞智能)  ·  商务报价  ·  FPV 无人机系统',
};

const GROUP_LABEL: Record<SummaryGroupKey, Record<Lang, string>> = {
  drone:      { ru: 'ДРОН',                    en: 'DRONE',                zh: '无人机' },
  components: { ru: 'КОМПОНЕНТЫ',              en: 'COMPONENTS',           zh: '配件' },
  ground:     { ru: 'НАЗЕМНОЕ ОБОРУДОВАНИЕ',   en: 'GROUND EQUIPMENT',     zh: '地面设备' },
  antennas:   { ru: 'АНТЕННЫ',                 en: 'ANTENNAS',             zh: '天线' },
};

const SUBTOTAL: Record<Lang, string> = { ru: 'Итого', en: 'Subtotal', zh: '小计' };
const GRAND_TOTAL: Record<Lang, string> = { ru: 'ИТОГО', en: 'GRAND TOTAL', zh: '合计' };
const UNITS: Record<Lang, string> = { ru: 'шт', en: 'units', zh: '件' };

const NAVY = '1F3864';
const NAVY_MID = '2E4E7E';
const BAND = 'F2F5F8';
const BAND_LT = 'E9EFF5';
const BORDER = 'D0D8E0';
const TXT_DARK = '1A1A1A';
const TXT_GREY = '555555';
const TXT_GREY_LT = '777777';
const TXT_GREY_MID = '444444';
const BLUE_LT = 'D0D8E0';
const BLUE_ACCENT = '4472C4';

function cell(ws: ExcelJS.Worksheet, row: number, col: number) { return ws.getCell(row, col); }

function thinBorder(c: ExcelJS.Cell, sides: ('top' | 'bottom' | 'left' | 'right')[] = ['top','bottom','left','right']) {
  const color = { argb: `FF${BORDER}` };
  const side: ExcelJS.BorderStyle = 'thin';
  const b: ExcelJS.Borders = {} as ExcelJS.Borders;
  for (const s of sides) (b as any)[s] = { style: side, color };
  c.border = b;
}

function fill(c: ExcelJS.Cell, hex: string) {
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${hex}` } };
}

function paintRange(ws: ExcelJS.Worksheet, row: number, hex: string, cols = 7) {
  for (let i = 1; i <= cols; i++) fill(cell(ws, row, i), hex);
}

function borderRange(ws: ExcelJS.Worksheet, row: number, cols = 7) {
  for (let i = 1; i <= cols; i++) thinBorder(cell(ws, row, i));
}

const GROUP_ORDER: SummaryGroupKey[] = ['drone', 'components', 'ground', 'antennas'];

function groupItems(items: SummaryItem[]): Record<SummaryGroupKey, SummaryItem[]> {
  const out: Record<SummaryGroupKey, SummaryItem[]> = { drone: [], components: [], ground: [], antennas: [] };
  for (const it of items) out[it.group].push(it);
  return out;
}

export async function downloadOrderXlsx(params: {
  groups: SummaryGroup[];
  grandTotal: number;
  cnyTotal: number;
  usdTotal: number;
  pricing: PricingParams;
  tier: Tier;
  lang: Lang;
}) {
  const { groups, grandTotal, cnyTotal, usdTotal, pricing, tier, lang } = params;
  const fobK = pricing.fobK;
  const rate = pricing.rate;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'AGR FPV Configurator';
  wb.created = new Date();
  const ws = wb.addWorksheet(lang === 'ru' ? 'Коммерческое предложение' : lang === 'zh' ? '商务报价' : 'Commercial Proposal');

  ws.columns = [
    { width: 5 },     // #
    { width: 36 },    // name
    { width: 42 },    // spec
    { width: 8 },     // qty
    { width: 13 },    // price CNY
    { width: 16.71 }, // total CNY
    { width: 17.42 }, // total USD
  ];

  let row = 1;

  // ── R1 TITLE ──
  ws.mergeCells(row, 1, row, 7);
  const title = cell(ws, row, 1);
  title.value = TITLE[lang];
  title.font = { name: 'Arial', bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  title.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  paintRange(ws, row, NAVY);
  ws.getRow(row).height = 33.75;
  row++;

  // ── R2 META BANNER ──
  ws.mergeCells(row, 1, row, 7);
  const meta = cell(ws, row, 1);
  const dateStr = new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'zh' ? 'zh-CN' : 'en-GB');
  meta.value = `${TIER_LABELS[tier][lang]}  |  Rate ${rate} CNY/USD  |  FOB ×${fobK}  |  ${dateStr}`;
  meta.font = { name: 'Arial', size: 9, color: { argb: `FF${BLUE_LT}` } };
  meta.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  paintRange(ws, row, NAVY);
  ws.getRow(row).height = 16.5;
  row++;

  // ── R3 COLUMN HEADERS ──
  COL_HEADERS[lang].forEach((h, i) => {
    const c = cell(ws, row, i + 1);
    c.value = h;
    c.font = { name: 'Arial', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    fill(c, NAVY);
    thinBorder(c);
  });
  ws.getRow(row).height = 21;
  row++;

  // ── DATA ──
  const cnyTotalRefs: string[] = []; // total CNY cell refs to sum into grand total

  groups.forEach(group => {
    const grouped = groupItems(group.items);

    for (const gk of GROUP_ORDER) {
      const rows = grouped[gk];
      if (!rows.length) continue;

      // Group header row
      ws.mergeCells(row, 1, row, 7);
      const gh = cell(ws, row, 1);
      const groupQty = rows.reduce((n, r) => n + r.qty, 0);
      gh.value = `▸  ${group.groupLabel.toUpperCase()}  ·  ${GROUP_LABEL[gk][lang]}  (${groupQty} ${UNITS[lang]})`;
      gh.font = { name: 'Arial', bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
      gh.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true, indent: 1 };
      paintRange(ws, row, NAVY_MID);
      // borders only on outer sides for merged group header (left, top, bottom)
      for (let i = 1; i <= 7; i++) {
        const c = cell(ws, row, i);
        const sides: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom'];
        if (i === 1) sides.push('left');
        if (i === 7) sides.push('right');
        thinBorder(c, sides);
      }
      ws.getRow(row).height = 22;
      row++;

      // Data rows
      let idx = 1;
      const startRow = row;
      for (const it of rows) {
        const c1 = cell(ws, row, 1);
        c1.value = idx++;
        c1.font = { name: 'Arial', size: 10, color: { argb: `FF${BLUE_ACCENT}` } };
        c1.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

        const c2 = cell(ws, row, 2);
        c2.value = it.name;
        c2.font = { name: 'Arial', bold: true, size: 10, color: { argb: `FF${TXT_DARK}` } };
        c2.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true, indent: 1 };

        const c3 = cell(ws, row, 3);
        c3.value = it.sub || '';
        c3.font = { name: 'Arial', size: 9, color: { argb: `FF${TXT_GREY}` } };
        c3.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

        const c4 = cell(ws, row, 4);
        c4.value = it.qty;
        c4.font = { name: 'Arial', size: 10, color: { argb: `FF${TXT_GREY_MID}` } };
        c4.alignment = { horizontal: 'right', vertical: 'middle' };

        const c5 = cell(ws, row, 5);
        c5.value = it.unitPrice;
        c5.font = { name: 'Arial', size: 10, color: { argb: `FF${BLUE_ACCENT}` } };
        c5.alignment = { horizontal: 'right', vertical: 'middle' };
        c5.numFmt = '#,##0.00';

        const c6 = cell(ws, row, 6);
        c6.value = { formula: `D${row}*E${row}`, result: it.qty * it.unitPrice } as ExcelJS.CellFormulaValue;
        c6.font = { name: 'Arial', bold: true, size: 10, color: { argb: `FF${NAVY}` } };
        c6.alignment = { horizontal: 'right', vertical: 'middle' };
        c6.numFmt = '#,##0.00';

        const c7 = cell(ws, row, 7);
        c7.value = { formula: `F${row}/${rate}`, result: (it.qty * it.unitPrice) / rate } as ExcelJS.CellFormulaValue;
        c7.font = { name: 'Arial', size: 10, color: { argb: `FF${BLUE_ACCENT}` } };
        c7.alignment = { horizontal: 'right', vertical: 'middle' };
        c7.numFmt = '#,##0.00';

        for (let i = 1; i <= 7; i++) fill(cell(ws, row, i), BAND);
        borderRange(ws, row);
        ws.getRow(row).height = 28;
        row++;
      }
      const endRow = row - 1;

      // Subtotal row
      ws.mergeCells(row, 1, row, 5);
      const slCell = cell(ws, row, 1);
      slCell.value = `${SUBTOTAL[lang]} ${GROUP_LABEL[gk][lang]}  ×  ${groupQty} ${UNITS[lang]}`;
      slCell.font = { name: 'Arial', bold: true, size: 10, color: { argb: `FF${NAVY}` } };
      slCell.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };

      const subCny = cell(ws, row, 6);
      subCny.value = { formula: `SUM(F${startRow}:F${endRow})`, result: rows.reduce((s, r) => s + r.price, 0) } as ExcelJS.CellFormulaValue;
      subCny.font = { name: 'Arial', bold: true, size: 11, color: { argb: `FF${NAVY}` } };
      subCny.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      subCny.numFmt = '#,##0.00';
      cnyTotalRefs.push(`F${row}`);

      const subUsd = cell(ws, row, 7);
      subUsd.value = { formula: `F${row}/${rate}`, result: rows.reduce((s, r) => s + r.price, 0) / rate } as ExcelJS.CellFormulaValue;
      subUsd.font = { name: 'Arial', bold: true, size: 10, color: { argb: `FF${BLUE_ACCENT}` } };
      subUsd.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      subUsd.numFmt = '#,##0.00';

      paintRange(ws, row, BAND_LT);
      borderRange(ws, row);
      ws.getRow(row).height = 22;
      row++;
    }
  });

  // ── GRAND TOTAL (with FOB applied) ──
  // raw sum of subtotal F-cells, then × fobK
  const sumExpr = cnyTotalRefs.length ? cnyTotalRefs.join('+') : '0';

  ws.mergeCells(row, 1, row, 5);
  const gtLabel = cell(ws, row, 1);
  gtLabel.value = `${GRAND_TOTAL[lang]}  (FOB ×${fobK})`;
  gtLabel.font = { name: 'Arial', bold: true, size: 11, color: { argb: `FF${NAVY}` } };
  gtLabel.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };

  const gtCny = cell(ws, row, 6);
  gtCny.value = { formula: `(${sumExpr})*${fobK}`, result: cnyTotal } as ExcelJS.CellFormulaValue;
  gtCny.font = { name: 'Arial', bold: true, size: 12, color: { argb: `FF${NAVY}` } };
  gtCny.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  gtCny.numFmt = '#,##0.00';

  const gtUsd = cell(ws, row, 7);
  gtUsd.value = { formula: `F${row}/${rate}`, result: usdTotal } as ExcelJS.CellFormulaValue;
  gtUsd.font = { name: 'Arial', bold: true, size: 11, color: { argb: `FF${BLUE_ACCENT}` } };
  gtUsd.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  gtUsd.numFmt = '#,##0.00';

  paintRange(ws, row, BAND_LT);
  borderRange(ws, row);
  ws.getRow(row).height = 26;
  row++;

  // ── FOOTER NOTE ──
  ws.mergeCells(row, 1, row, 7);
  const note = cell(ws, row, 1);
  const noteText = lang === 'ru'
    ? `Курс CNY/USD: ${rate}  |  FOB ×${fobK}  |  Σ(qty × unit) = ¥${grandTotal.toLocaleString()}  ·  значения можно править — формулы пересчитаются`
    : lang === 'zh'
      ? `汇率 CNY/USD: ${rate}  |  FOB ×${fobK}  |  Σ(qty × unit) = ¥${grandTotal.toLocaleString()}  ·  可修改数值，公式会自动重算`
      : `Rate CNY/USD: ${rate}  |  FOB ×${fobK}  |  Σ(qty × unit) = ¥${grandTotal.toLocaleString()}  ·  edit values — formulas will recalc`;
  note.value = noteText;
  note.font = { name: 'Arial', size: 8, color: { argb: `FF${TXT_GREY_LT}` } };
  note.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  paintRange(ws, row, BAND);
  ws.getRow(row).height = 18;

  // ── DOWNLOAD ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agr-fpv-proposal-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
