import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BCDFormManager } from '../../services/bcd-form-manager';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { chargeCodeTypeOptions } from '../../libs/bcd-options';
import { BaseDialog } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-bcd-charges-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FormModule, InputTextModule, SelectModule],
  templateUrl: './bcd-charges-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdChargesFormDialog extends BaseDialog {
  // Services
  private bcdFormManager = inject(BCDFormManager);

  // index
  recordIndex: number | undefined = undefined;

  // form
  form = this.bcdFormManager.createChargeForm();
  chargeCodeTypeOptions = chargeCodeTypeOptions;

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
