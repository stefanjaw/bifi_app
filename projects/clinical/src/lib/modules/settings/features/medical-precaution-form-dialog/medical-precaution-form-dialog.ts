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
import { InputText } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormModule } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CrudMedicalPrecautions } from '../../services/crud-medical-precautions';
import { MedicalPrecautionForm } from '../../services/medical-precaution-form';
import { medicalPrecaution } from '../../interfaces/settings';

@Component({
  selector: 'bifi-app-medical-precaution-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputText,
    ToggleSwitch,
    FormModule,
    TranslatePipe,
    ButtonModule,
  ],
  templateUrl: './medical-precaution-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Dialog for creating or editing a medical precaution */
export class MedicalPrecautionFormDialog extends BaseDialog {
  private crud = inject(CrudMedicalPrecautions);
  protected formService = inject(MedicalPrecautionForm);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  editEntity = signal<medicalPrecaution | null>(null);
  submitLoading = signal(false);
  isUpdate = signal(false);
  saved = output<void>();

  open(entity?: medicalPrecaution): void {
    this.editEntity.set(entity ?? null);
    this.isUpdate.set(!!entity);
    this.formService.reset();
    if (entity) this.formService.patchValue(entity);
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
