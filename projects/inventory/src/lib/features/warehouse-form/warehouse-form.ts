import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WarehouseFormService, WarehouseFormModel } from '../../services/warehouse-form';

@Component({
  selector: 'bifi-app-warehouse-form',
  imports: [FormModule, ReactiveFormsModule, InputText, ProgressBarModule, HasPermission],
  templateUrl: './warehouse-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseForm {
  protected formService = inject(WarehouseFormService);
  private crudWarehouses = inject(CrudWarehouses);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  form = this.formService.form;

  warehouseResource = this.crudWarehouses.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = this.warehouseResource.isLoading;
  isSubmitLoading = signal(false);

  constructor() {
    effect(() => {
      const entry = this.warehouseResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          code: entry.code,
          address: entry.address ?? '',
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<WarehouseFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const isNew = !this.isUpdate();
    const action = isNew
      ? this.crudWarehouses.post({ data: rawValue as any })
      : this.crudWarehouses.put({ _id: this.id(), data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: (result: any) => {
        this.isSubmitLoading.set(false);
        if (isNew) {
          const newId = result?._id ?? result?.data?._id;
          this.router.navigate(newId ? ['/inventory/warehouses', newId] : ['/inventory/warehouses']);
        } else {
          this.router.navigate(['/inventory/warehouses']);
        }
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/inventory/warehouses']);
  }
}
