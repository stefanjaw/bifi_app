import { GroupReturn } from '@avalantec/base-app/form';
import {
  bcdFormChargeModel,
  bcdFormModel,
  bcdFormRecordModel,
  bcdFormTaxEntryModel,
} from '../interfaces/bcd-form';

/**
 * Calculates the amount of a tax entry based on the given form values.
 * If the amount value is not null, it returns the amount value.
 * If the amount value is null, it calculates the tax amount by multiplying the value for tax by the rate percentage divided by 100, and returns the calculated value.
 * @param tax The tax entry object containing the code, value for tax, rate percentage and amount values.
 * @returns The calculated tax amount, or the amount value if no percentage is provided.
 */
export function calculateTax(tax: GroupReturn<bcdFormTaxEntryModel>) {
  const valueForTax = tax.value.valueForTax ?? 0;
  const rate = tax.value.ratePercentage ?? 0;
  const amount = tax.value.amount;

  // If percentage exists and is valid → ALWAYS recalc
  if (rate > 0) {
    return Number((valueForTax * (rate / 100)).toFixed(2));
  }

  // If no percentage → respect manual amount
  return amount ?? 0;
}

/**
 * Calculates the amount of a charge based on the given form values.
 * If the percentage value is not null, it returns the calculated charge amount by multiplying the base amount by the percentage divided by 100.
 * If the percentage value is null, it returns the amount value, or 0 if no amount value is provided.
 * @param charge The charge object containing the percentage and amount values.
 * @param baseAmount The base amount to multiply the percentage by.
 * @returns The calculated charge amount, or the amount value if no percentage is provided.
 */
export function calculateCharge(charge: GroupReturn<bcdFormChargeModel>, baseAmount: number) {
  const percentage = charge.value.percentage ?? 0;
  const amount = charge.value.amount;

  // If percentage exists → ALWAYS recalc
  if (percentage > 0) {
    return Number(((percentage / 100) * baseAmount).toFixed(2));
  }

  // If no percentage → respect manual amount
  return amount ?? 0;
}

/**
 * Calculates the values of a BCD record.
 * It calculates the base value, charges, BDA value, taxes and total due.
 * @param record - The BCD record object containing the lines subtotal, exchange rate, charges, taxes and total due values.
 */
export function calculateRecord(record: GroupReturn<bcdFormRecordModel>) {
  // Calculate base
  const base = Number(
    ((record.value.linesSubtotal || 0) * (record.value.exchangeRate || 0)).toFixed(2)
  );

  // calculate charges
  record.controls.charges.controls.forEach(c =>
    c.controls.amount.setValue(calculateCharge(c, base), { emitEvent: false })
  );

  // total charges
  const chargeAmount = record.value.charges?.reduce((acc, c) => acc + (c.amount ?? 0), 0);

  // BDA value
  record.controls.bdaValue.setValue(base + (chargeAmount ?? 0), { emitEvent: false });

  // calculate taxes
  record.controls.tax?.controls.forEach(t =>
    t.controls.amount.setValue(calculateTax(t), { emitEvent: false })
  );

  // total taxes
  const taxAmount = record.value.tax?.reduce((acc, t) => acc + (t.amount ?? 0), 0);

  // calculate total due
  record.controls.totalDue.setValue((record.value.bdaValue ?? 0) + (taxAmount ?? 0), {
    emitEvent: false,
  });
}

/**
 * Calculates the values of a BCD.
 * It calculates the records count, invoice amount, charges, payable amount.
 * @param bcd - The BCD form object containing the records, charges, invoice amount, payable amount values.
 */
export function calculateBCD(bcd: GroupReturn<bcdFormModel>) {
  const records = bcd.controls.records?.controls || [];
  const charges = bcd.controls.charges?.controls || [];

  // calculate records count
  bcd.controls.recordsCount.setValue(records.length, { emitEvent: false });

  // calculate each record
  records.forEach(r => calculateRecord(r as any));

  // calculate invoice amount
  const invoiceAmount = records.reduce((acc, r) => acc + (r.value.totalDue ?? 0), 0);
  bcd.controls.invoiceAmount.setValue(invoiceAmount, { emitEvent: false });

  // calculate charges
  charges.forEach(c =>
    c.controls.amount.setValue(calculateCharge(c, invoiceAmount), { emitEvent: false })
  );

  // total charges
  const chargeAmount = charges.reduce((acc, c) => acc + (c.value.amount ?? 0), 0);
  const recordsDueAmount = records.reduce((acc, r) => acc + (r.value.totalDue ?? 0), 0);

  // calculate payable amount
  bcd.controls.payableAmount.setValue(chargeAmount + recordsDueAmount, { emitEvent: false });
}
