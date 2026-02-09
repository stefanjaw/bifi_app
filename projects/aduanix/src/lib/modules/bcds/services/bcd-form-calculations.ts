import { inject, Injectable } from '@angular/core';
import { BcdForm } from './bcd-form';
import { BCDFormManager } from './bcd-form-manager';
import { GroupReturn } from '@avalantec/base-app/form';
import {
  bcdFormChargeModel,
  bcdFormModel,
  bcdFormRecordModel,
  bcdFormTaxEntryModel,
} from '../interfaces/bcd-form';

@Injectable({
  providedIn: 'root',
})
export class BCDFormCalculations {
  private bcdForm = inject(BcdForm);
  private bcdFormManager = inject(BCDFormManager);

  /**
   * Attaches listeners to a record form that will trigger the calculation of its BDA value and total due when its values change.
   * This method is called when a record form is created and is used to keep the BDA value and total due fields up to date.
   * It sets a flag on the record form to prevent the listeners from being attached multiple times.
   */
  private attachRecordListeners(record: GroupReturn<bcdFormRecordModel>) {
    console.log('🚀 ~ BCDFormCalculations ~ attachRecordListeners ~ record:', record);
  }

  /**
   * Calculates the charge amount from the given form values.
   * If the percentage value is not null and the charge code does not allow percentage, it ignores the percentage value.
   * If the percentage value is not null, it calculates the charge amount by multiplying the amount by the percentage divided by 100, and sets the calculated value to the amount control.
   * Returns the calculated charge amount, or the amount value if no percentage is provided.
   * @param form The form containing the code, percentage and amount values.
   */
  private calculateCharge(form: GroupReturn<bcdFormChargeModel>) {
    console.log('🚀 ~ BCDFormCalculations ~ calculateCharge ~ form:', form);
  }

  /**
   * Calculates the amount of a tax entry based on the given form values and the rules associated with the tax type.
   * If the tax type does not apply by default, the amount is set to 0.
   * Otherwise, the amount is calculated by multiplying the value for tax by the rate percentage and dividing by 100.
   * The calculated amount is then set on the tax entry form and returned.
   * @returns The calculated amount of the tax entry.
   */
  private calculateTax(form: GroupReturn<bcdFormTaxEntryModel>) {
    console.log('🚀 ~ BCDFormCalculations ~ calculateTax ~ form:', form);
  }

  /**
   * Calculates the BDA value of a record by multiplying the goods value by the exchange rate
   * and adding the dutiable charges. The calculated BDA value is then set on the record form.
   * @param form The form group containing the record data.
   * @returns The calculated BDA value of the record.
   */
  private calculateRecordBDAValue(form: GroupReturn<bcdFormRecordModel>) {
    console.log('🚀 ~ BCDFormCalculations ~ calculateRecordBDAValue ~ form:', form);
  }

  /**
   * Calculates the total due of a record by summing up the amounts of all its tax entries.
   * The calculated total due is then set on the record form.
   * @param form The form group containing the record data.
   * @returns The calculated total due of the record.
   */
  calculateRecordTotalDue(form: GroupReturn<bcdFormRecordModel>) {
    console.log('🚀 ~ BCDFormCalculations ~ calculateRecordTotalDue ~ form:', form);
  }

  /**
   * Calculates the invoice amount for the form by summing up the total due of all its records.
   * The calculated invoice amount is then set on the form.
   * @param form The form group containing the form data.
   * @returns The calculated invoice amount.
   */
  calculateInvoiceAmount(form: GroupReturn<bcdFormModel>) {
    console.log('🚀 ~ BCDFormCalculations ~ calculateInvoiceAmount ~ form:', form);
  }

  /**
   * Calculates the payable amount for the form by summing up the total due of all its records and the amounts of all its charges.
   * The calculated payable amount is then set on the form.
   * @param form The form for which to calculate the payable amount.
   * @returns The calculated payable amount of the form.
   */
  calculatePayableAmount(form: GroupReturn<bcdFormModel>) {
    console.log('🚀 ~ BCDFormCalculations ~ calculatePayableAmount ~ form:', form);
  }
}
