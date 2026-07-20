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
import { CrudOrderSets } from '../../services/crud-order-sets';
import { OrderSetForm } from '../../services/order-set-form';
import { orderSet } from '../../interfaces/clinical-orders';

@Component({
  selector: 'bifi-app-order-set-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputText,
    ToggleSwitch,
    FormModule,
    TranslatePipe,
    ButtonModule,
  ],
  templateUrl: './order-set-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSetFormDialog extends BaseDialog {
  private crud = inject(CrudOrderSets);
  protected formService = inject(OrderSetForm);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  editEntity = signal<orderSet | null>(null);
  submitLoading = signal(false);
  isUpdate = signal(false);
  saved = output<void>();

  open(entity?: orderSet): void {
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
