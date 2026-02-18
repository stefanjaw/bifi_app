import { GroupReturn } from '@avalantec/base-app/form';
import {
  bcdFormChargeModel,
  bcdFormModel,
  bcdFormRecordModel,
  bcdFormTaxEntryModel,
} from '../interfaces/bcd-form';
import { bcdChargeCode } from '../../bcd-charge-codes';

/**
 * Rounds a number to 2 decimal places.
 * This function uses the built-in Math.round() function to round the number,
 * but first adds a small value (Number.EPSILON) to the number to avoid
 * rounding errors due to floating point precision.
 * @param {number} value - The number to round.
 * @returns {number} The rounded number.
 */
export function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates the amount of a tax based on the given form values.
 * If the percentage value is not null, it returns the calculated tax amount by multiplying the base amount by the percentage divided by 100.
 * If the percentage value is null, it returns the amount value, or 0 if no amount value is provided.
 * @param {GroupReturn<bcdFormTaxEntryModel>} tax - The tax object containing the valueForTax, ratePercentage and amount values.
 * @returns {number} The calculated tax amount, or the amount value if no percentage is provided.
 */
export function calculateTax(tax: GroupReturn<bcdFormTaxEntryModel>) {
  const valueForTax = tax.value.valueForTax ?? 0;
  const rate = tax.value.ratePercentage ?? 0;
  const amount = tax.value.amount;

  // If percentage exists and is valid → ALWAYS recalc
  if (rate > 0) {
    return valueForTax * (rate / 100);
  }

  // If no percentage → respect manual amount
  return amount ?? 0;
}

/**
 * Calculates the amount of a charge based on the given form values.
 * If the percentage value is not null, it returns the calculated charge amount by multiplying the base amount by the percentage divided by 100.
 * If the percentage value is null, it returns the amount value, or 0 if no amount value is provided.
 * @param {GroupReturn<bcdFormChargeModel>} charge - The charge object containing the percentage and amount values.
 * @param {number} baseAmount - The base amount to multiply the percentage by.
 * @returns {number} The calculated charge amount, or the amount value if no percentage is provided.
 */
export function calculateCharge(charge: GroupReturn<bcdFormChargeModel>, baseAmount: number) {
  const percentage = charge.value.percentage ?? 0;
  const amount = charge.value.amount;

  // If percentage exists → ALWAYS recalc
  if (percentage > 0) {
    return (percentage / 100) * baseAmount;
  }

  // If no percentage → respect manual amount
  return amount ?? 0;
}

/**
 * Calculates the values of a BCD record.
 * It calculates the base value, charges, taxes and total due.
 * @param record - The BCD record object containing the lines subtotal, exchange rate, charges, taxes and total due values.
 * @param customCharges - A Record containing the custom charge codes.
 */
export function calculateRecord(
  record: GroupReturn<bcdFormRecordModel>,
  customCharges: Record<string, bcdChargeCode>
) {
  // 1️ Base value
  const base = round2((record.value.linesSubtotal || 0) * (record.value.exchangeRate || 0));
  const charges = record.controls.charges.controls || [];
  const taxes = record.controls.tax.controls || [];

  // 2️ Charges - calculate each charge
  charges.forEach(c => {
    c.controls.amount.setValue(round2(calculateCharge(c, base)), { emitEvent: false });
  });

  record.controls.bdaValue.setValue(base, { emitEvent: false });

  // 4️ Taxes - calculate each tax
  taxes.forEach(t => {
    t.controls.valueForTax.setValue(record.value.bdaValue ?? 0, { emitEvent: false });
    t.controls.amount.setValue(round2(calculateTax(t)), { emitEvent: false });
  });

  const taxAmount = record.value.tax?.reduce((acc, t) => acc + (t.amount ?? 0), 0);

  // 5️ Charges that effect payable
  const chargePayableAmount = charges
    ?.filter(
      c =>
        customCharges[c.value.code || '']?.impact?.payable &&
        customCharges[c.value.code || '']?.type !== 'S'
    )
    .reduce((acc, c) => {
      const type = customCharges[c.value.code || '']?.type;
      return type === 'D' ? acc - (c.value.amount ?? 0) : acc + (c.value.amount ?? 0);
    }, 0);

  // calculate total due
  record.controls.totalDue.setValue(Math.max(0, round2((taxAmount ?? 0) + chargePayableAmount)), {
    emitEvent: false,
  });
}

/**
 * Calculates the values of a BCD.
 * It calculates the records count, invoice amount, header charges, total header charges payable, records due and final payable amount.
 * @param bcd - The BCD document object containing the records, charges, invoice amount, payable amount values.
 * @param customCharges - A Record containing the custom charge codes.
 */
export function calculateBCD(
  bcd: GroupReturn<bcdFormModel>,
  customCharges: Record<string, bcdChargeCode>
) {
  const records = bcd.controls.records?.controls || [];
  const charges = bcd.controls.charges?.controls || [];

  bcd.controls.recordsCount.setValue(records.length, { emitEvent: false });

  // 1️ Records
  records.forEach(r => calculateRecord(r as any, customCharges));

  // 2️ Invoice amount - sum of all records
  const invoiceAmount = records.reduce((acc, r) => acc + (r.value.bdaValue ?? 0), 0);
  bcd.controls.invoiceAmount.setValue(round2(invoiceAmount), { emitEvent: false });

  // 3️ Header charges
  charges.forEach(c =>
    c.controls.amount.setValue(round2(calculateCharge(c, invoiceAmount)), { emitEvent: false })
  );

  // 4️ Header payable
  const headerChargeAmount = charges
    .filter(
      c =>
        customCharges[c.value.code || '']?.impact?.payable &&
        customCharges[c.value.code || '']?.type !== 'S'
    )
    .reduce((acc, c) => {
      const type = customCharges[c.value.code || '']?.type;
      return type === 'D' ? acc - (c.value.amount ?? 0) : acc + (c.value.amount ?? 0);
    }, 0);

  // total due
  const recordsDue = round2(records.reduce((acc, r) => acc + (r.value.totalDue ?? 0), 0));

  // calculate payable amount
  bcd.controls.payableAmount.setValue(round2(headerChargeAmount + recordsDue), {
    emitEvent: false,
  });
}
