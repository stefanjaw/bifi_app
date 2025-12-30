import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BaseDialog, Text } from '@avalantec/base-app/core';
import { FormModule } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'bifi-app-invoice-lines-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FormModule, Text],
  templateUrl: './invoice-lines-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceLinesFormDialog extends BaseDialog {
  //   protected formService = inject(InvoiceLinesForm);
  //   private crudInvoiceLine = inject(CrudInvoiceLine);
  //   form = this.formService.form;

  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);
  shippingCreated = output<void>();
}
