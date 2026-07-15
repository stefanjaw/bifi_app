import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CrudBCDTaxId } from '../../services/crud-bcd-tax-id';
import { CrudBCDTaxType } from '../../services/crud-bcd-tax-type';
import { ProgressBarModule } from 'primeng/progressbar';
import { BCDFormManager } from '../../../bcds';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-bcd-taxes-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    SelectModule,
    ProgressBarModule,
    TranslatePipe,
  ],
  templateUrl: './bcd-taxes-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdTaxesFormDialog extends BaseDialog {
  //Services
  private bcdFormManager = inject(BCDFormManager);
  private crudBCDTaxId = inject(CrudBCDTaxId);
  private crudBCDTaxType = inject(CrudBCDTaxType);

  //index
  recordIndex!: number;

  // Resources
  taxIdResource = this.crudBCDTaxId.get({
    triggerRequest: this.dialogState,
  });
  taxTypeResource = this.crudBCDTaxType.get({
    triggerRequest: this.dialogState,
  });

  //Form
  form = this.bcdFormManager.createTaxEntryForm();
  taxTypeOptions = this.taxTypeResource.value;
  taxIdTypeOptions = this.taxIdResource.value;
  loading = computed(() => this.taxIdResource.isLoading() || this.taxTypeResource.isLoading());

  //Dialog Methods
  override openDialog(recordIndex?: number) {
    this.recordIndex = recordIndex || 0;
    this.form = this.bcdFormManager.createTaxEntryForm();
    super.openDialog();
  }

  //Submit Method
  handleSubmit() {
    // this.bcdFormManager.addTax(this.recordIndex, this.form);
    this.closeDialog();
  }
}
