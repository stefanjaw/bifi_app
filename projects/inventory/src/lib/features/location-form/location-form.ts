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
import { CrudLocations } from '../../services/crud-locations';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface LocationFormModel {
  name: string;
  code: string;
  warehouseId: string;
  capacity: number;
}

@Component({
  selector: 'bifi-app-location-form',
  imports: [FormModule, ReactiveFormsModule, InputText, InputNumberModule, SelectModule, ProgressBarModule],
  templateUrl: './location-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationForm extends BaseForm<LocationFormModel> {
  private crudLocations = inject(CrudLocations);
  private crudWarehouses = inject(CrudWarehouses);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');
  warehouseIdParam = input<string>('');

  locationResource = this.crudLocations.get({ id: this.id, triggerRequest: computed(() => !!this.id()) });
  warehousesResource = this.crudWarehouses.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() => this.locationResource.isLoading() || this.warehousesResource.isLoading());
  isSubmitLoading = signal(false);

  warehouses = this.warehousesResource.value;

  override createForm() {
    return this.fb.group<LocationFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      capacity: [0],
    });
  }

  constructor() {
    super();
    effect(() => {
      const entry = this.locationResource.value();
      if (entry) {
        this.patchValue({
          name: entry.name,
          code: entry.code,
          warehouseId: entry.warehouseId?._id ?? '',
          capacity: entry.capacity ?? 0,
        });
        this.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.reset();
        if (this.warehouseIdParam()) {
          this.form.patchValue({ warehouseId: this.warehouseIdParam() });
        }
      }
    });
  }

  handleSubmit(data: FormValueState<LocationFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudLocations.put({ _id: this.id(), data: rawValue as any })
      : this.crudLocations.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    const entry = this.locationResource.value();
    const wid = this.warehouseIdParam() || entry?.warehouseId?._id;
    if (wid) {
      this.router.navigate(['/inventory/warehouses', wid]);
    } else {
      this.router.navigate(['/inventory/warehouses']);
    }
  }
}
