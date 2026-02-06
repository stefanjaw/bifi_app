import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BCDFormManager } from '../../services/bcd-form-manager';
import { CrudBCDAdditionalInformationType } from '../../services/crud-bcd-additional-information-type';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-bcd-additional-information-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    SelectModule,
    ProgressBarModule,
  ],
  templateUrl: './bcd-additional-information-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdAdditionalInformationFormDialog extends BaseDialog {
  // Services
  private bcdFormManager = inject(BCDFormManager);
  private crudBCDAdditionalInformationTypes = inject(CrudBCDAdditionalInformationType);

  // index
  recordIndex: number | undefined = undefined;

  // resources
  bcdAdditionalInformationTypeOptionsResource = this.crudBCDAdditionalInformationTypes.get({});

  // form
  form = this.bcdFormManager.createAdditionalInformationForm();
  additionalInformationTypeOptions = this.bcdAdditionalInformationTypeOptionsResource.value;
  loading = this.bcdAdditionalInformationTypeOptionsResource.isLoading;

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
