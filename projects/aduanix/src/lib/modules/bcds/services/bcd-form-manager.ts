import { GroupReturn } from '@avalantec/base-app/form';
import { BcdForm } from './bcd-form';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  bcdFormAdditionalInformationModel,
  bcdFormChargeModel,
  bcdFormRecordModel,
} from '../interfaces/bcd-form';

@Injectable({
  providedIn: 'root',
})
export class BCDFormManager {
  private form = inject(BcdForm);

  //#region House BOLAWB
  addHouseBOLAWB(value: string = '') {
    const houseBOLAWBArray = this.form.form.controls.houseBOLAWB;
    houseBOLAWBArray.push(new FormControl<string>(value, { nonNullable: true }));
  }

  removeHouseBOLAWB(index: number) {
    const houseBOLAWBArray = this.form.form.controls.houseBOLAWB;
    houseBOLAWBArray.removeAt(index);
  }
  //#endregion

  //#region Containers
  addContainer(value: string = '') {
    const containersArray = this.form.form.controls.containersIds;
    containersArray.push(new FormControl<string>(value, { nonNullable: true }));
  }

  removeContainer(index: number) {
    const containersArray = this.form.form.controls.containersIds;
    containersArray.removeAt(index);
  }
  //#endregion

  //#region Charges
  createChargeForm() {
    return this.form.fb.group<bcdFormChargeModel>({
      code: ['212', [Validators.required]],
      percentage: [0, [Validators.min(0), Validators.max(100)]],
      amount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addCharge(form: GroupReturn<bcdFormChargeModel>, recordIndex: number | undefined = undefined) {
    const chargesArray = recordIndex
      ? this.form.form.controls.records.at(recordIndex).controls.charges
      : this.form.form.controls.charges;
    chargesArray.push(form);
  }

  removeCharge(index: number, recordIndex: number | undefined = undefined) {
    const chargesArray = recordIndex
      ? this.form.form.controls.records.at(recordIndex).controls.charges
      : this.form.form.controls.charges;
    chargesArray.removeAt(index);
  }
  //#endregion

  //#region Additional information
  createAdditionalInformationForm() {
    return this.form.fb.group<bcdFormAdditionalInformationModel>({
      type: ['TXT', [Validators.required, Validators.maxLength(3)]],
      value: ['', [Validators.required, Validators.maxLength(70)]],
    });
  }

  addAdditionalInformation(
    form: GroupReturn<bcdFormAdditionalInformationModel>,
    recordIndex: number | undefined = undefined
  ) {
    const additionalInformationArray = recordIndex
      ? this.form.form.controls.records.at(recordIndex).controls.additionalInformation
      : this.form.form.controls.additionalInformation;
    additionalInformationArray.push(form);
  }

  removeAdditionalInformation(index: number, recordIndex: number | undefined = undefined) {
    const additionalInformationArray = recordIndex
      ? this.form.form.controls.records.at(recordIndex).controls.additionalInformation
      : this.form.form.controls.additionalInformation;
    additionalInformationArray.removeAt(index);
  }
  //#endregion

  //#region Payment Accounts
  addPaymentAccount(value: string = '') {
    const paymentAccountArray = this.form.form.controls.paymentAccounts;
    paymentAccountArray.push(new FormControl<string>(value, { nonNullable: true }));
  }

  removePaymentAccount(index: number) {
    const paymentAccountArray = this.form.form.controls.paymentAccounts;
    paymentAccountArray.removeAt(index);
  }
  //#endregion

  //#region Records
  createRecordForm() {
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
      charges: {
        template: {
          code: ['212', [Validators.required]],
          percentage: [0, [Validators.min(0), Validators.max(100)]],
          amount: [0, [Validators.required, Validators.min(0)]],
        },
        validators: [Validators.required, Validators.minLength(1)],
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
        validators: [Validators.minLength(1)],
        formArrayElements: [],
      },
      additionalInformation: {
        template: {
          type: ['TXT', [Validators.required, Validators.maxLength(3)]],
          value: ['', [Validators.required, Validators.maxLength(70)]],
        },
        validators: [Validators.minLength(1)],
        formArrayElements: [],
      },
    });
  }

  addRecord(form: GroupReturn<bcdFormRecordModel>) {
    const recordsArray = this.form.form.controls.records;
    recordsArray.push(form as any);
  }

  removeRecord(index: number) {
    const recordsArray = this.form.form.controls.records;
    recordsArray.removeAt(index);
  }
  //#endregion
}
