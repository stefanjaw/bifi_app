import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BCDFormManager } from '../../services/bcd-form-manager';
import { taxIdTypeOptions, taxTypeOptions } from '../../libs/bcd-options';

@Component({
  selector: 'bifi-app-bcd-taxes-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FormModule, InputTextModule, SelectModule],
  templateUrl: './bcd-taxes-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdTaxesFormDialog extends BaseDialog {
  //Services
  private bcdFormManager = inject(BCDFormManager);

  //index
  recordIndex!: number;

  //Form
  form = this.bcdFormManager.createTaxEntryForm();
  taxTypeOptions = taxTypeOptions;
  taxIdTypeOptions = taxIdTypeOptions;

  //Dialog Methods
  override openDialog(recordIndex?: number) {
    this.recordIndex = recordIndex || 0;
    this.form = this.bcdFormManager.createTaxEntryForm();
    super.openDialog();
  }

  //Submit Method
  handleSubmit() {
    this.bcdFormManager.addTax(this.recordIndex, this.form);
    this.closeDialog();
  }
}
