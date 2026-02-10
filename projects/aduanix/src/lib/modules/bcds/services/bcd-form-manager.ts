/* eslint-disable @typescript-eslint/no-inferrable-types */
import { GroupReturn } from '@avalantec/base-app/form';
import { computed, effect, inject, Injectable, untracked } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  bcdFormAdditionalInformationModel,
  bcdFormChargeModel,
  bcdFormRecordModel,
  bcdFormTaxEntryModel,
} from '../interfaces/bcd-form';
import { toSignal } from '@angular/core/rxjs-interop';
import { BcdForm } from './bcd-form';
import { CrudBCDAdditionalInformationType } from '../../bcd-additional-information-types';
import { CrudBCDTaxId, CrudBCDTaxType } from '../../bcd-taxes';
import { CrudBCDTransportOption } from '../../bcd-transport-options';
import { CrudBCDType } from '../../bcd-types';
import { CrudBCDCpc } from '../../bcd-cpcs';
import { FilterManager } from '@avalantec/base-app/resource';
import { CrudBCDChargeCode } from '../../bcd-charge-codes';
import { CrudBCDPort } from '../../bcd-ports';

@Injectable({
  providedIn: 'root',
})
export class BCDFormManager {
  // services
  private form = inject(BcdForm);
  private filterManager = inject(FilterManager);
  private crudAdditionalInformationType = inject(CrudBCDAdditionalInformationType);
  private crudTaxId = inject(CrudBCDTaxId);
  private crudTaxType = inject(CrudBCDTaxType);
  private crudTransportOption = inject(CrudBCDTransportOption);
  private crudBCDType = inject(CrudBCDType);
  private crudBCDCpc = inject(CrudBCDCpc);
  private crudBCDChargeCode = inject(CrudBCDChargeCode);
  private crudBCDPort = inject(CrudBCDPort);

  // states
  currentBCDType = toSignal(this.form.form.controls.type.valueChanges, {
    initialValue: this.form.form.controls.type.value,
  });
  currentTransportType = toSignal(this.form.form.controls.transport.controls.type.valueChanges, {
    initialValue: this.form.form.controls.transport.controls.type.value,
  });

  // filters
  bcdCpcFilter = computed(() =>
    this.filterManager.getFilterObjectUtil([
      {
        operator: 'and',
        filters: [{ field: 'bcdTypes', operator: 'in', value: this.currentBCDType() || '' }],
      },
    ])
  );

  // resources
  private bcdAdditionalInformationTypeResource = this.crudAdditionalInformationType.get({});
  private bcdTaxIdResource = this.crudTaxId.get({});
  private bcdTaxTypeResource = this.crudTaxType.get({});
  private bcdTypeResource = this.crudBCDType.get({});
  private bcdChargeCodeResource = this.crudBCDChargeCode.get({});
  private bcdPortResource = this.crudBCDPort.get({});
  private bcdTransportOptionResource = this.crudTransportOption.get({
    searchParams: computed(() => ({ type: this.currentTransportType() })),
  });
  private bcdCpcResource = this.crudBCDCpc.get({
    searchParams: this.bcdCpcFilter,
    triggerRequest: computed(() => !!this.currentBCDType()),
  });

  // options
  bcdAdditionalInformationTypeOptions = this.bcdAdditionalInformationTypeResource.value;
  bcdTaxIdOptions = this.bcdTaxIdResource.value;
  bcdTaxTypeOptions = this.bcdTaxTypeResource.value;
  bcdTypeOptions = this.bcdTypeResource.value;
  bcdCpcOptions = this.bcdCpcResource.value;
  bcdChargeCodeOptions = this.bcdChargeCodeResource.value;
  bcdPortOptions = this.bcdPortResource.value;
  bcdTransportOptions = this.bcdTransportOptionResource.value;

  /**
   * Attaches listeners to the form controls.
   * When the records array changes, it recalculates the global totals
   * and updates the form controls accordingly.
   */
  constructor() {
    // reset dependent fields when transport type changes
    effect(() => {
      this.currentTransportType();
      untracked(() => this.form.form.controls.transport.controls.aircraftOrVessel.setValue(''));
    });

    // reset dependent fields when bcd type changes
    effect(() => {
      this.currentBCDType();
      untracked(() =>
        this.form.form.controls.records.controls.forEach(r => r.patchValue({ cpc: '' }))
      );
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
      amount: [0, [Validators.min(0)]],
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
      type: ['', [Validators.required]],
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
      cpc: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      tariff: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      quantityTwo: [0, [Validators.min(0)]],
      supplementaryCode: ['', [Validators.required, Validators.maxLength(10)]],
      currency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      linesSubtotal: [0, [Validators.required, Validators.min(0)]],
      exchangeRate: [0, [Validators.required, Validators.min(0)]],
      bdaValue: [0, [Validators.min(0)]],
      totalDue: [0, [Validators.min(0)]],
      charges: {
        template: {
          code: ['212', [Validators.required]],
          percentage: [0, [Validators.min(0), Validators.max(100)]],
          amount: [0, [Validators.min(0)]],
        },
        formArrayElements: [],
      },
      tax: {
        template: {
          type: ['CUD', [Validators.required]],
          taxId: ['F', [Validators.required]],
          valueForTax: [0, [Validators.required, Validators.min(0)]],
          ratePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
          amount: [0, [Validators.min(0)]],
        },
        formArrayElements: [],
      },
      additionalInformation: {
        template: {
          type: ['', [Validators.required]],
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
      amount: [0, [Validators.min(0)]],
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
}
