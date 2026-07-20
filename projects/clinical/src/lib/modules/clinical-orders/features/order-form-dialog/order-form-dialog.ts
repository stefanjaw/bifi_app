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
import { CrudOrders } from '../../services/crud-orders';
import { OrderForm } from '../../services/order-form';
import { order } from '../../interfaces/clinical-orders';

@Component({
  selector: 'bifi-app-order-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputText,
    ToggleSwitch,
    FormModule,
    TranslatePipe,
    ButtonModule,
  ],
  templateUrl: './order-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormDialog extends BaseDialog {
  private crud = inject(CrudOrders);
  protected formService = inject(OrderForm);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  editEntity = signal<order | null>(null);
  submitLoading = signal(false);
  isUpdate = signal(false);
  saved = output<void>();

  open(entity?: order): void {
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
