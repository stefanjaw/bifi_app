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
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormModule } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CrudStaff } from '../../services/crud-staff';
import { StaffForm } from '../../services/staff-form';
import { staff } from '../../interfaces/staff';
import { contact } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-staff-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    InputText,
    DatePicker,
    ToggleSwitch,
    FormModule,
    TranslatePipe,
    ButtonModule,
  ],
  templateUrl: './staff-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Dialog for creating or editing a staff member */
export class StaffFormDialog extends BaseDialog {
  private crud = inject(CrudStaff);
  protected formService = inject(StaffForm);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  selectedContact = signal<contact | null>(null);
  editEntity = signal<staff | null>(null);
  submitLoading = signal(false);
  isUpdate = signal(false);
  saved = output<void>();

  open(entity?: staff, contact?: contact): void {
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
