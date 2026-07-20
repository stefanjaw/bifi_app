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
import { CrudShifts } from '../../services/crud-shifts';
import { ShiftForm } from '../../services/shift-form';
import { shift } from '../../interfaces/staff';

@Component({
  selector: 'bifi-app-shift-form-dialog',
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
  templateUrl: './shift-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Dialog for creating or editing a shift */
export class ShiftFormDialog extends BaseDialog {
  private crud = inject(CrudShifts);
  protected formService = inject(ShiftForm);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  editEntity = signal<shift | null>(null);
  submitLoading = signal(false);
  isUpdate = signal(false);
  saved = output<void>();

  open(entity?: shift): void {
    this.editEntity.set(entity ?? null);
    this.isUpdate.set(!!entity);
    this.formService.reset();
    if (entity) this.formService.patchValue(entity as any);
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
