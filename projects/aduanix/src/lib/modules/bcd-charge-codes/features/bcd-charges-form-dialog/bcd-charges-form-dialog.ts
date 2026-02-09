import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BaseDialog } from '@avalantec/base-app/core';
import { BCDFormManager } from '../../../bcds';
import { CrudBCDChargeCode } from '../../services/crud-bcd-charge-code';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-bcd-charges-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    SelectModule,
    ProgressBarModule,
  ],
  templateUrl: './bcd-charges-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdChargesFormDialog extends BaseDialog {
  // Services
  private bcdFormManager = inject(BCDFormManager);
  private crudBCDChargeCode = inject(CrudBCDChargeCode);

  // index
  recordIndex: number | undefined = undefined;

  // resources
  bcdChargeCodeResource = this.crudBCDChargeCode.get({
    triggerRequest: this.dialogState,
  });

  // form
  form = this.bcdFormManager.createChargeForm();
  bcdChargeCodeOptions = this.bcdChargeCodeResource.value;
  loading = this.bcdChargeCodeResource.isLoading;

  // methods
  override openDialog(recordIndex: number | undefined = undefined) {
    this.recordIndex = recordIndex;
    this.form = this.bcdFormManager.createChargeForm();
    super.openDialog();
  }

  handleSubmit() {
    this.bcdFormManager.addCharge(this.form, this.recordIndex);
    this.closeDialog();
  }
}
