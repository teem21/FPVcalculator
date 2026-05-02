import ExcelJS from 'exceljs';
import type { Lang, Tier, SummaryGroup } from '@/types';
import type { PricingParams } from './pricing';

const TIER_LABELS: Record<Tier, Record<Lang, string>> = {
  0: { ru: 'Образец (1 шт)', en: 'Sample (1 pc)', zh: '样品 (1件)' },
  1: { ru: 'от 1 000 шт', en: 'From 1,000 pcs', zh: '1000件起' },
  2: { ru: 'от 5 000 шт', en: 'From 5,000 pcs', zh: '5000件起' },
};

const COL_HEADERS: Record<Lang, [string, string, string, string, string]> = {
  ru: ['#', 'Наименование', 'Кол-во', 'Цена ед. (¥)', 'Сумма (¥)'],
  en: ['#', 'Item', 'Qty', 'Unit price (¥)', 'Total (¥)'],
  zh: ['#', '产品名称', '数量', '单价 (¥)', '总价 (¥)'],
};

const ACCENT = '1A3A5C';
const ACCENT_LT = 'E8EEF5';
const BORDER_COLOR = 'DDDBD6';
const WHITE = 'FFFFFF';
const GREEN = '1A6B3C';
const GREEN_LT = 'E8F5EE';

function cell(ws: ExcelJS.Worksheet, row: number, col: number): ExcelJS.Cell {
  return ws.getCell(row, col);
}

function applyBorder(c: ExcelJS.Cell) {
  const side: ExcelJS.BorderStyle = 'thin';
  const color = { argb: `FF${BORDER_COLOR}` };
  c.border = { top: { style: side, color }, bottom: { style: side, color }, left: { style: side, color }, right: { style: side, color } };
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

  const wb = new ExcelJS.Workbook();
  wb.creator = 'FPV Configurator';
  wb.created = new Date();

  const ws = wb.addWorksheet('Order');

  // Column widths
  ws.columns = [
    { width: 5 },
    { width: 36 },
    { width: 10 },
    { width: 16 },
    { width: 16 },
  ];

  let row = 1;

  // ── TITLE ROW ──
  ws.mergeCells(row, 1, row, 5);
  const titleCell = cell(ws, row, 1);
  titleCell.value = lang === 'ru' ? 'FPV ДРОНЫ — ЗАКАЗ' : lang === 'en' ? 'FPV DRONES — ORDER' : 'FPV 无人机 — 订单';
  titleCell.font = { bold: true, size: 14, color: { argb: `FF${WHITE}` } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${ACCENT}` } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(row).height = 28;
  row++;

  // ── META ROW ──
  ws.mergeCells(row, 1, row, 3);
  const metaLeft = cell(ws, row, 1);
  metaLeft.value = `${TIER_LABELS[tier][lang]}   •   ${new Date().toLocaleDateString('ru-RU')}`;
  metaLeft.font = { size: 10, color: { argb: 'FF6B6860' } };
  metaLeft.alignment = { horizontal: 'left', vertical: 'middle' };

  ws.mergeCells(row, 4, row, 5);
  const metaRight = cell(ws, row, 4);
  metaRight.value = `USD/CNY: ${pricing.rate}   FOB ×${pricing.fobK}`;
  metaRight.font = { size: 10, color: { argb: 'FF6B6860' } };
  metaRight.alignment = { horizontal: 'right', vertical: 'middle' };
  ws.getRow(row).height = 20;
  row++;

  // spacer
  row++;

  // ── COLUMN HEADERS ──
  const headers = COL_HEADERS[lang];
  headers.forEach((h, i) => {
    const c = cell(ws, row, i + 1);
    c.value = h;
    c.font = { bold: true, size: 11, color: { argb: `FF${WHITE}` } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${ACCENT}` } };
    c.alignment = { horizontal: i === 1 ? 'left' : 'center', vertical: 'middle' };
    applyBorder(c);
  });
  ws.getRow(row).height = 22;
  row++;

  // ── DATA ROWS ──
  let itemIndex = 1;

  groups.forEach((group, gi) => {
    // Config group header
    ws.mergeCells(row, 1, row, 5);
    const groupCell = cell(ws, row, 1);
    groupCell.value = `— ${group.groupLabel.toUpperCase()} —`;
    groupCell.font = { bold: true, size: 10, color: { argb: `FF${ACCENT}` } };
    groupCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${ACCENT_LT}` } };
    groupCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(row).height = 18;
    row++;

    group.items.forEach(item => {
      const cols = [
        itemIndex,
        item.name,
        item.qty,
        item.unitPrice,
        item.price,
      ];
      cols.forEach((val, i) => {
        const c = cell(ws, row, i + 1);
        c.value = val;
        c.font = { size: 11 };
        c.alignment = {
          horizontal: i === 1 ? 'left' : 'center',
          vertical: 'middle',
        };
        if (i === 3 || i === 4) {
          c.numFmt = '¥#,##0';
          c.alignment = { horizontal: 'right', vertical: 'middle' };
        }
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: row % 2 === 0 ? 'FFF7F6F3' : `FF${WHITE}` } };
        applyBorder(c);
      });
      ws.getRow(row).height = 18;
      row++;
      itemIndex++;
    });

    // Config subtotal (only when multiple configs)
    if (groups.length > 1) {
      const subtotalLabel = lang === 'ru' ? `Итого ${group.groupLabel}` : lang === 'en' ? `Subtotal ${group.groupLabel}` : `小计 ${group.groupLabel}`;
      ws.mergeCells(row, 1, row, 4);
      const slCell = cell(ws, row, 1);
      slCell.value = subtotalLabel;
      slCell.font = { bold: true, size: 11, italic: true, color: { argb: `FF${ACCENT}` } };
      slCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${ACCENT_LT}` } };
      slCell.alignment = { horizontal: 'right', vertical: 'middle' };
      applyBorder(slCell);

      const stCell = cell(ws, row, 5);
      stCell.value = group.total;
      stCell.numFmt = '¥#,##0';
      stCell.font = { bold: true, size: 11, color: { argb: `FF${ACCENT}` } };
      stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${ACCENT_LT}` } };
      stCell.alignment = { horizontal: 'right', vertical: 'middle' };
      applyBorder(stCell);
      ws.getRow(row).height = 20;
      row++;
    }

    // spacer between configs
    if (gi < groups.length - 1) row++;
  });

  row++;

  // ── GRAND TOTAL CNY ──
  ws.mergeCells(row, 1, row, 4);
  const gtLabel = cell(ws, row, 1);
  gtLabel.value = lang === 'ru' ? 'ИТОГО (¥ с FOB)' : lang === 'en' ? 'TOTAL (¥ FOB)' : '合计 (¥ 含FOB)';
  gtLabel.font = { bold: true, size: 12, color: { argb: `FF${WHITE}` } };
  gtLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${ACCENT}` } };
  gtLabel.alignment = { horizontal: 'right', vertical: 'middle' };
  applyBorder(gtLabel);

  const gtVal = cell(ws, row, 5);
  gtVal.value = cnyTotal;
  gtVal.numFmt = '¥#,##0';
  gtVal.font = { bold: true, size: 12, color: { argb: `FF${WHITE}` } };
  gtVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${ACCENT}` } };
  gtVal.alignment = { horizontal: 'right', vertical: 'middle' };
  applyBorder(gtVal);
  ws.getRow(row).height = 24;
  row++;

  // ── USD TOTAL ──
  ws.mergeCells(row, 1, row, 4);
  const usdLabel = cell(ws, row, 1);
  usdLabel.value = lang === 'ru' ? '≈ ИТОГО (USD FOB)' : lang === 'en' ? '≈ TOTAL (USD FOB)' : '≈ 合计 (USD FOB)';
  usdLabel.font = { bold: true, size: 12, color: { argb: `FF${WHITE}` } };
  usdLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GREEN}` } };
  usdLabel.alignment = { horizontal: 'right', vertical: 'middle' };
  applyBorder(usdLabel);

  const usdVal = cell(ws, row, 5);
  usdVal.value = usdTotal;
  usdVal.numFmt = '$#,##0';
  usdVal.font = { bold: true, size: 12, color: { argb: `FF${WHITE}` } };
  usdVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GREEN}` } };
  usdVal.alignment = { horizontal: 'right', vertical: 'middle' };
  applyBorder(usdVal);
  ws.getRow(row).height = 24;
  row++;

  // ── FORMULA NOTE ──
  ws.mergeCells(row, 1, row, 5);
  const noteCell = cell(ws, row, 1);
  noteCell.value = `¥${grandTotal.toLocaleString()} × ${pricing.fobK} ÷ ${pricing.rate} = $${usdTotal.toLocaleString()}`;
  noteCell.font = { size: 9, italic: true, color: { argb: 'FFA8A59E' } };
  noteCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GREEN_LT}` } };
  noteCell.alignment = { horizontal: 'right', vertical: 'middle' };
  ws.getRow(row).height = 16;

  // ── DOWNLOAD ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fpv-order-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
