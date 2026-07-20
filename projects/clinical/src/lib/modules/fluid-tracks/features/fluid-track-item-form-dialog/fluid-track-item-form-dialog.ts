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
import { CrudFluidTrackItems } from '../../services/crud-fluid-track-items';
import { FluidTrackItemForm } from '../../services/fluid-track-item-form';
import { fluidTrackItem } from '../../interfaces/fluid-tracks';

@Component({
  selector: 'bifi-app-fluid-track-item-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputText,
    ToggleSwitch,
    FormModule,
    TranslatePipe,
    ButtonModule,
  ],
  templateUrl: './fluid-track-item-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FluidTrackItemFormDialog extends BaseDialog {
  private crud = inject(CrudFluidTrackItems);
  protected formService = inject(FluidTrackItemForm);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  editEntity = signal<fluidTrackItem | null>(null);
  submitLoading = signal(false);
  isUpdate = signal(false);
  saved = output<void>();

  open(entity?: fluidTrackItem): void {
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
