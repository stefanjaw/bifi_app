import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BCDFormManager } from '../../services/bcd-form-manager';
import { additionalInformationTypeOptions } from '../../libs/bcd-options';

@Component({
  selector: 'bifi-app-bcd-additional-information-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FormModule, InputTextModule, SelectModule],
  templateUrl: './bcd-additional-information-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdAdditionalInformationFormDialog extends BaseDialog {
  // Services
  private bcdFormManager = inject(BCDFormManager);

  // index
  recordIndex: number | undefined = undefined;

  // form
  form = this.bcdFormManager.createAdditionalInformationForm();
  additionalInformationTypeOptions = additionalInformationTypeOptions;

  // methods
  override openDialog(recordIndex: number | undefined = undefined) {
    this.recordIndex = recordIndex;
    this.form = this.bcdFormManager.createAdditionalInformationForm();
    super.openDialog();
  }

  handleSubmit() {
    this.bcdFormManager.addAdditionalInformation(this.form, this.recordIndex);
    this.closeDialog();
  }
}
