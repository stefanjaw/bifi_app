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
import { CrudLocations } from '../../services/crud-locations';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationFormService, LocationFormModel } from '../../services/location-form.service';

@Component({
  selector: 'bifi-app-location-form',
  imports: [FormModule, ReactiveFormsModule, InputText, InputNumberModule, SelectModule, ProgressBarModule],
  templateUrl: './location-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationForm {
  protected formService = inject(LocationFormService);
  private crudLocations = inject(CrudLocations);
  private crudWarehouses = inject(CrudWarehouses);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');
  warehouseIdParam = input<string>('');

  form = this.formService.form;

  locationResource = this.crudLocations.get({ id: this.id, triggerRequest: computed(() => !!this.id()) });
  warehousesResource = this.crudWarehouses.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() => this.locationResource.isLoading() || this.warehousesResource.isLoading());
  isSubmitLoading = signal(false);

  warehouses = this.warehousesResource.value;

  constructor() {
    effect(() => {
      const entry = this.locationResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          code: entry.code,
          warehouseId: entry.warehouseId?._id ?? '',
          capacity: entry.capacity ?? 0,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
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
