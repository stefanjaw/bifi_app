import {
  ChangeDetectionStrategy,
  Component,
  inject,
  DestroyRef,
  signal,
  output,
} from '@angular/core';
import { BaseDialog } from '@avalantec/base-app/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { FormModule } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CrudVendors } from '../../services/crud-vendors';
import { VendorForm } from '../../services/vendor-form';
import { vendor } from '../../interfaces/vendors';
import { contact } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-vendor-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    InputText,
    DatePicker,
    FormModule,
    TranslatePipe,
    ButtonModule,
  ],
  templateUrl: './vendor-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Dialog for creating or editing a vendor */
export class VendorFormDialog extends BaseDialog {
  private crud = inject(CrudVendors);
  protected formService = inject(VendorForm);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  selectedContact = signal<contact | null>(null);
  editEntity = signal<vendor | null>(null);
  submitLoading = signal(false);
  isUpdate = signal(false);
  saved = output<void>();

  open(entity?: vendor, contact?: contact): void {
    this.editEntity.set(entity ?? null);
    this.selectedContact.set(contact ?? null);
    this.isUpdate.set(!!entity);
    this.formService.reset();
    if (entity) {
      this.formService.patchValue(entity as any);
    }
    if (contact) {
      this.form.controls.contactId.setValue(contact._id);
    }
    super.openDialog();
  }

  handleSubmit(): void {
    this.submitLoading.set(true);
    const raw = this.form.getRawValue();
    const obs = this.isUpdate()
      ? this.crud.put({ _id: this.editEntity()!._id, data: raw })
      : this.crud.post({ data: raw });
    obs.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.saved.emit();
        this.closeDialog();
      },
      error: () => this.submitLoading.set(false),
    });
  }
}
