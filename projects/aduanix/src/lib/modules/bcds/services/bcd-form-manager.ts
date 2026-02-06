/* eslint-disable @typescript-eslint/no-inferrable-types */
import { GroupReturn } from '@avalantec/base-app/form';
import { BcdForm } from './bcd-form';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  bcdFormAdditionalInformationModel,
  bcdFormChargeModel,
  bcdFormModel,
  bcdFormRecordModel,
  bcdFormTaxEntryModel,
} from '../interfaces/bcd-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BCDFormManager {
  private form = inject(BcdForm);
  private destroy$ = inject(DestroyRef);

  /**
   * Attaches listeners to the form controls.
   * When the records array changes, it recalculates the global totals
   * and updates the form controls accordingly.
   */
  constructor() {
    this.form.form.controls.records.valueChanges
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => {
        const recordForms = this.form.form.controls.records;

        // records count
        this.form.form.controls.recordsCount.setValue(recordForms.length);

        // attach listeners and recalc
        recordForms.controls.forEach(record => {
          this.attachRecordListeners(record as any);

          // taxes and charges
          record.controls.charges.controls.forEach(charge => this.calculateCharge(charge));
          record.controls.tax.controls.forEach(tax => this.calculateTax(tax));

          // recalculate
          this.calculateRecordBDAValue(record as any);
          this.calculateRecordTotalDue(record as any);
        });

        // global totals
        this.form.form.controls.charges.controls.forEach(charge => this.calculateCharge(charge));
        this.calculateInvoiceAmount(this.form.form);
        this.calculatePayableAmount(this.form.form);
      });
  }

  //#region House BOLAWB

  /**
   * Adds a new house BOLAWB control to the form.
   * The value parameter is optional and defaults to an empty string.
   * The new control is a required string control.
   * @param {string} [value=''] The initial value of the new control.
   */
  addHouseBOLAWB(value: string = '') {
    const houseBOLAWBArray = this.form.form.controls.houseBOLAWB;
    houseBOLAWBArray.push(new FormControl<string>(value, { nonNullable: true }));
  }

  /**
   * Removes a house BOLAWB control from the form at the given index.
   * @param {number} index The index of the control to remove.
   */
  removeHouseBOLAWB(index: number) {
    const houseBOLAWBArray = this.form.form.controls.houseBOLAWB;
    houseBOLAWBArray.removeAt(index);
  }
  //#endregion

  //#region Containers

  /**
   * Adds a new container ID control to the form.
   * The value parameter is optional and defaults to an empty string.
   * The new control is a required string control.
   * @param {string} [value=''] The initial value of the new control.
   */
  addContainer(value: string = '') {
    const containersArray = this.form.form.controls.containerIds;
    containersArray.push(new FormControl<string>(value, { nonNullable: true }));
  }

  /**
   * Removes a container ID control from the form at the given index.
   * @param {number} index The index of the control to remove.
   */
  removeContainer(index: number) {
    const containersArray = this.form.form.controls.containerIds;
    containersArray.removeAt(index);
  }
  //#endregion

  //#region Charges

  /**
   * Creates a new charge form.
   * The form group contains three controls: code, percentage and amount.
   * The code control is required and must be a string with a value of '212'.
   * The percentage control is required and must be a number between 0 and 100.
   * The amount control is required and must be a number greater than or equal to 0.
   * @returns The newly created charge form group.
   */
  createChargeForm() {
    return this.form.fb.group<bcdFormChargeModel>({
      code: ['212', [Validators.required]],
      percentage: [0, [Validators.min(0), Validators.max(100)]],
      amount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  /**
   * Adds a charge form to the array of charge forms in the form.
   * If a record index is provided, the method adds the charge form to the array of charge forms in the record at the given index.
   * Otherwise, the method adds the charge form to the array of charge forms in the main form.
   * @param form The charge form to add.
   * @param recordIndex The index of the record to which to add the charge form. Defaults to undefined.
   */
  addCharge(form: GroupReturn<bcdFormChargeModel>, recordIndex: number | undefined = undefined) {
    const chargesArray =
      recordIndex !== undefined
        ? this.form.form.controls.records.at(recordIndex).controls.charges
        : this.form.form.controls.charges;

    chargesArray.push(form);
  }

  /**
   * Removes a charge form from the array of charge forms in the form.
   * This method removes the charge form at the given index from the array of charge forms.
   * If a record index is provided, the method removes the charge form from the array of charge forms in the record at the given index.
   * Otherwise, the method removes the charge form from the array of charge forms in the main form.
   * @param index The index of the charge form to remove.
   * @param recordIndex The index of the record from which to remove the charge form. Defaults to undefined.
   */
  removeCharge(index: number, recordIndex: number | undefined = undefined) {
    const chargesArray =
      recordIndex !== undefined
        ? this.form.form.controls.records.at(recordIndex).controls.charges
        : this.form.form.controls.charges;

    chargesArray.removeAt(index);
  }
  //#endregion

  //#region Additional information

  /**
   * Creates a new additional information form.
   * This method creates a new form group for an additional information form.
   * The form group contains two controls: type and value.
   * The type control is required and must be a string with a maximum length of 3.
   * The value control is required and must be a string with a maximum length of 70.
   * @returns The newly created additional information form group.
   */
  createAdditionalInformationForm() {
    return this.form.fb.group<bcdFormAdditionalInformationModel>({
      type: ['TXT', [Validators.required, Validators.maxLength(3)]],
      value: ['', [Validators.required, Validators.maxLength(70)]],
    });
  }

  /**
   * Adds an additional information form to the array of additional information forms in the form.
   * This method adds the given additional information form to the array of additional information forms in the form.
   * If a record index is provided, the method adds the additional information form to the array of additional information forms in the record at the given index.
   * Otherwise, the method adds the additional information form to the array of additional information forms in the main form.
   * @param form The additional information form to add.
   * @param recordIndex The index of the record to which to add the additional information form. Defaults to undefined.
   */
  addAdditionalInformation(
    form: GroupReturn<bcdFormAdditionalInformationModel>,
    recordIndex: number | undefined = undefined
  ) {
    const additionalInformationArray =
      recordIndex !== undefined
        ? this.form.form.controls.records.at(recordIndex).controls.additionalInformation
        : this.form.form.controls.additionalInformation;

    additionalInformationArray.push(form);
  }

  /**
   * Removes an additional information form from the array of additional information forms in the form.
   * This method removes the additional information form at the given index from the array of additional information forms.
   * If a record index is provided, the method removes the additional information form from the array of additional information forms in the record at the given index.
   * Otherwise, the method removes the additional information form from the array of additional information forms in the main form.
   * @param index The index of the additional information form to remove.
   * @param recordIndex The index of the record from which to remove the additional information form. Defaults to undefined.
   */
  removeAdditionalInformation(index: number, recordIndex: number | undefined = undefined) {
    const additionalInformationArray =
      recordIndex !== undefined
        ? this.form.form.controls.records.at(recordIndex).controls.additionalInformation
        : this.form.form.controls.additionalInformation;

    additionalInformationArray.removeAt(index);
  }
  //#endregion

  //#region Payment Accounts

  /**
   * Adds a new payment account to the array of payment accounts in the form.
   * The new payment account is created with the given value and a non-nullable validator.
   * If no value is provided, an empty string is used as the value.
   * @param value The value of the new payment account. Defaults to an empty string.
   */
  addPaymentAccount(value: string = '') {
    const paymentAccountArray = this.form.form.controls.paymentAccounts;
    paymentAccountArray.push(new FormControl<string>(value, { nonNullable: true }));
  }

  /**
   * Removes a payment account form from the array of payment accounts in the form.
   * This method removes the payment account at the given index from the array of payment accounts.
   * @param index The index of the payment account to remove.
   */
  removePaymentAccount(index: number) {
    const paymentAccountArray = this.form.form.controls.paymentAccounts;
    paymentAccountArray.removeAt(index);
  }
  //#endregion

  //#region Records

  /**
   * Create a form group for a single record with all the required fields
   * @returns A form group with all the required fields for a record
   */
  private createRecordForm() {
    return this.form.fb.group<bcdFormRecordModel>({
      number: [0, [Validators.required, Validators.min(0)]],
      cpc: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      origin: ['', [Validators.required]],
      tariff: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      quantityTwo: [0, [Validators.min(0)]],
      supplementaryCode: ['', [Validators.required, Validators.maxLength(10)]],
      currency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      linesSubtotal: [0, [Validators.required, Validators.min(0)]],
      exchangeRate: [0, [Validators.required, Validators.min(0)]],
      bdaValue: [0, [Validators.required, Validators.min(0)]],
      totalDue: [0, [Validators.required, Validators.min(0)]],
      charges: {
        template: {
          code: ['212', [Validators.required]],
          percentage: [0, [Validators.min(0), Validators.max(100)]],
          amount: [0, [Validators.required, Validators.min(0)]],
        },
        formArrayElements: [],
      },
      tax: {
        template: {
          type: ['CUD', [Validators.required]],
          taxId: ['F', [Validators.required]],
          valueForTax: [0, [Validators.required, Validators.min(0)]],
          ratePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
          amount: [0, [Validators.required, Validators.min(0)]],
        },
        formArrayElements: [],
      },
      additionalInformation: {
        template: {
          type: ['TXT', [Validators.required, Validators.maxLength(3)]],
          value: ['', [Validators.required, Validators.maxLength(70)]],
        },
        formArrayElements: [],
      },
    });
  }

  /**
   * Adds a new record form to the array of records in the form.
   * This method creates a new form using `createRecordForm` and adds it to the array of records.
   * The new form is added to the end of the array.
   */
  addRecord() {
    const form = this.createRecordForm();
    const recordsArray = this.form.form.controls.records;

    recordsArray.push(form as any);
  }

  /**
   * Removes a record form from the array of records in the form.
   * This method removes the record at the given index from the array of records.
   * @param index The index of the record to remove.
   */
  removeRecord(index: number) {
    const recordsArray = this.form.form.controls.records;
    recordsArray.removeAt(index);
  }
  //#endregion

  //#region Taxes

  /**
   * Creates a form group for a single tax entry with the required fields
   * @returns A form group with all the required fields for a tax entry
   */
  createTaxEntryForm() {
    return this.form.fb.group<bcdFormTaxEntryModel>({
      type: ['CUD', [Validators.required]],
      taxId: ['F', [Validators.required]],
      valueForTax: [0, [Validators.required, Validators.min(0)]],
      ratePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      amount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  /**
   * Adds a tax entry to the array of tax entries in the record at the given index.
   * @param recordIndex The index of the record to which to add the tax entry.
   * @param value The tax entry to add.
   */
  addTax(recordIndex: number, value: GroupReturn<bcdFormTaxEntryModel>) {
    const taxArray = this.form.form.controls.records.at(recordIndex).controls.tax;
    taxArray.push(value);
  }

  /**
   * Removes a tax entry from the array of tax entries in the record at the given index.
   * This method removes the tax entry at the given index from the array of tax entries.
   * @param index The index of the tax entry to remove.
   * @param recordIndex The index of the record from which to remove the tax entry.
   */
  removeTax(index: number, recordIndex: number) {
    const taxArray = this.form.form.controls.records.at(recordIndex).controls.tax;
    taxArray.removeAt(index);
  }

  //#endregion

  //#region Calculations

  /**
   * Attaches listeners to a record form that will trigger the calculation of its BDA value and total due when its values change.
   * This method is called when a record form is created and is used to keep the BDA value and total due fields up to date.
   * It sets a flag on the record form to prevent the listeners from being attached multiple times.
   */
  private attachRecordListeners(record: GroupReturn<bcdFormRecordModel>) {
    if ((record as any).__listenersAttached) return;

    (record as any).__listenersAttached = true;

    record.valueChanges.pipe(takeUntilDestroyed(this.destroy$)).subscribe(() => {
      // taxes and charges
      record.controls.charges.controls.forEach(charge => this.calculateCharge(charge));
      record.controls.tax.controls.forEach(tax => this.calculateTax(tax));

      // bda
      this.calculateRecordBDAValue(record);
      this.calculateRecordTotalDue(record);
    });
  }

  /**
   * Calculates the charge amount from the given form values.
   * If the percentage value is not null and the charge code does not allow percentage, it ignores the percentage value.
   * If the percentage value is not null, it calculates the charge amount by multiplying the amount by the percentage divided by 100, and sets the calculated value to the amount control.
   * Returns the calculated charge amount, or the amount value if no percentage is provided.
   * @param form The form containing the code, percentage and amount values.
   */
  private calculateCharge(form: GroupReturn<bcdFormChargeModel>) {
    const { code, percentage, amount } = form.getRawValue();
    const rule = chargeRules[code];

    if (percentage != null && !rule.allowPercentage) {
      // porcentaje no permitido → ignorar
      return amount ?? 0;
    }

    if (percentage != null) {
      const calculated = +(amount * (percentage / 100)).toFixed(2);
      form.controls.amount.setValue(calculated, { emitEvent: false });
      return calculated;
    }

    return amount ?? 0;
  }

  /**
   * Calculates the amount of a tax entry based on the given form values and the rules associated with the tax type.
   * If the tax type does not apply by default, the amount is set to 0.
   * Otherwise, the amount is calculated by multiplying the value for tax by the rate percentage and dividing by 100.
   * The calculated amount is then set on the tax entry form and returned.
   * @returns The calculated amount of the tax entry.
   */
  private calculateTax(form: GroupReturn<bcdFormTaxEntryModel>) {
    const { type, valueForTax, ratePercentage } = form.getRawValue();
    const rule = taxRules[type];

    if (!rule || !rule.appliesByDefault) {
      form.controls.amount.setValue(0, { emitEvent: false });
      return 0;
    }

    const amount = +(valueForTax * (ratePercentage / 100)).toFixed(2);
    form.controls.amount.setValue(amount, { emitEvent: false });

    return amount;
  }

  /**
   * Calculates the BDA value of a record by multiplying the goods value by the exchange rate
   * and adding the dutiable charges. The calculated BDA value is then set on the record form.
   * @param form The form group containing the record data.
   * @returns The calculated BDA value of the record.
   */
  private calculateRecordBDAValue(form: GroupReturn<bcdFormRecordModel>) {
    const goodsValue = form.controls.linesSubtotal.getRawValue();
    const exchangeRate = form.controls.exchangeRate.getRawValue();

    const goodsValueBDA = goodsValue * exchangeRate;

    const dutiableCharges = form.controls.charges.controls.reduce((acc, chargeForm) => {
      const amount = this.calculateCharge(chargeForm);
      const rule = chargeRules[chargeForm.controls.code.value];

      if (!rule.defaultDutiable || amount <= 0) return acc;
      return acc + amount;
    }, 0);

    const bdaValue = +(goodsValueBDA + dutiableCharges).toFixed(2);

    form.controls.bdaValue.setValue(bdaValue, { emitEvent: false });
    return bdaValue;
  }

  /**
   * Calculates the total due of a record by summing up the amounts of all its tax entries.
   * The calculated total due is then set on the record form.
   * @param form The form group containing the record data.
   * @returns The calculated total due of the record.
   */
  calculateRecordTotalDue(form: GroupReturn<bcdFormRecordModel>) {
    const total = form.controls.tax?.getRawValue().reduce((acc, tax) => acc + tax.amount, 0) ?? 0;

    form.controls.totalDue.setValue(+total.toFixed(2), { emitEvent: false });
    return total;
  }

  /**
   * Calculates the invoice amount for the form by summing up the total due of all its records.
   * The calculated invoice amount is then set on the form.
   * @param form The form group containing the form data.
   * @returns The calculated invoice amount.
   */
  calculateInvoiceAmount(form: GroupReturn<bcdFormModel>) {
    const invoiceAmount = form.controls.records.controls.reduce(
      (acc, recordForm) => acc + (recordForm.controls.bdaValue.value ?? 0),
      0
    );

    form.controls.invoiceAmount.setValue(+invoiceAmount.toFixed(2), {
      emitEvent: false,
    });

    return invoiceAmount;
  }

  /**
   * Calculates the payable amount for the form by summing up the total due of all its records and the amounts of all its charges.
   * The calculated payable amount is then set on the form.
   * @param form The form for which to calculate the payable amount.
   * @returns The calculated payable amount of the form.
   */
  calculatePayableAmount(form: GroupReturn<bcdFormModel>) {
    const recordsTotal = form.controls.records.controls.reduce(
      (acc, recordForm) => acc + (recordForm.controls.totalDue.value ?? 0),
      0
    );

    const headerChargesTotal = form.controls.charges.controls.reduce(
      (acc, chargeForm) => acc + this.calculateCharge(chargeForm),
      0
    );

    const payableAmount = recordsTotal + headerChargesTotal;

    form.controls.payableAmount.setValue(+payableAmount.toFixed(2), {
      emitEvent: false,
    });

    return payableAmount;
  }

  //#endregion
}
