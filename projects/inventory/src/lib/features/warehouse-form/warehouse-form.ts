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
import { BaseForm, FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface WarehouseFormModel {
  name: string;
  code: string;
  address: string;
}

@Component({
  selector: 'bifi-app-warehouse-form',
  imports: [FormModule, ReactiveFormsModule, InputText, ProgressBarModule],
  templateUrl: './warehouse-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseForm extends BaseForm<WarehouseFormModel> {
  private crudWarehouses = inject(CrudWarehouses);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  warehouseResource = this.crudWarehouses.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = this.warehouseResource.isLoading;
  isSubmitLoading = signal(false);

  override createForm() {
    return this.fb.group<WarehouseFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      address: [''],
    });
  }

  constructor() {
    super();
    effect(() => {
      const entry = this.warehouseResource.value();
      if (entry) {
        this.patchValue({
          name: entry.name,
          code: entry.code,
          address: entry.address ?? '',
        });
        this.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.reset();
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
