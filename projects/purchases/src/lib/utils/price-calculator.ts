export interface LineItemInput {
  quantity: number;
  unitPrice: number;
}

export interface TaxOption {
  _id: string;
  percentage: number;
}

export interface AppliedTaxPreview {
  taxId: string;
  name: string;
  percentage: number;
  amount: number;
}

export interface TotalsPreview {
  subtotal: number;
  appliedTaxes: AppliedTaxPreview[];
  taxTotal: number;
  grandTotal: number;
}

export function calculateLineItemTotal(quantity: number, unitPrice: number): number {
  return Number((quantity * unitPrice).toFixed(2));
}

export function calculateSubtotal(lineItems: LineItemInput[]): number {
  const raw = lineItems.reduce((sum, item) => {
    return sum + calculateLineItemTotal(Number(item.quantity ?? 0), Number(item.unitPrice ?? 0));
  }, 0);
  return Number(raw.toFixed(2));
}

/**
 * Calculates totals using per-line tax IDs.
 * Each line item has its own taxIds; taxes are aggregated by taxId across all lines.
 */
export function calculateTotalsPerLine(
  lineItems: LineItemInput[],
  lineTaxIds: string[][],
  allTaxes: TaxOption[],
  discountedUnitPrices?: number[],
): TotalsPreview {
  const taxMap = new Map<string, TaxOption>(allTaxes.map(t => [t._id, t]));

  const effectiveItems = lineItems.map((item, i) => ({
    quantity: item.quantity,
    unitPrice: discountedUnitPrices ? (discountedUnitPrices[i] ?? item.unitPrice) : item.unitPrice,
  }));

  const subtotal = calculateSubtotal(effectiveItems);
  const aggregated = new Map<string, { tax: TaxOption; amount: number }>();

  effectiveItems.forEach((item, i) => {
    const lineBase = calculateLineItemTotal(Number(item.quantity ?? 0), Number(item.unitPrice ?? 0));
    const itemTaxIds = lineTaxIds[i] ?? [];
    for (const taxId of itemTaxIds) {
      const tax = taxMap.get(taxId);
      if (!tax) continue;
      const amount = Number((lineBase * ((tax.percentage ?? 0) / 100)).toFixed(2));
      const existing = aggregated.get(taxId);
      if (existing) {
        existing.amount = Number((existing.amount + amount).toFixed(2));
      } else {
        aggregated.set(taxId, { tax, amount });
      }
    }
  });

  const appliedTaxes: AppliedTaxPreview[] = [];
  let taxTotal = 0;
  for (const [, { tax, amount }] of aggregated) {
    appliedTaxes.push({
      taxId: tax._id,
      name: (tax as any).name ?? '',
      percentage: tax.percentage,
      amount,
    });
    taxTotal = Number((taxTotal + amount).toFixed(2));
  }

  taxTotal = Number(taxTotal.toFixed(2));
  const grandTotal = Number((subtotal + taxTotal).toFixed(2));
  return { subtotal, appliedTaxes, taxTotal, grandTotal };
}
