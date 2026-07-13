import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudInventorySettings } from '../../services/crud-inventory-settings';
import {
  InventorySettingsForm,
  InventorySettingsFormModel,
} from '../../services/inventory-settings-form';
import { CrudWarehouses } from '../../../../services/crud-warehouses';
import { CrudLocations } from '../../../../services/crud-locations';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-inventory-settings-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    ButtonModule,
    ProgressBarModule,
    TranslatePipe,
  ],
  templateUrl: './inventory-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySettingsFormComponent {
  private crudInventorySettings = inject(CrudInventorySettings);
  private formService = inject(InventorySettingsForm);
  private crudWarehouses = inject(CrudWarehouses);
  private crudLocations = inject(CrudLocations);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);

  protected settingsResource = this.crudInventorySettings.getSettings();
  protected warehousesResource = this.crudWarehouses.get({});
  protected locationsResource = this.crudLocations.get({});

  protected _selectedWarehouseId = signal<string | null>(null);

  protected warehouseOptions = computed(() => (this.warehousesResource.value() as any[]) ?? []);

  protected locationOptions = computed(() => {
    const wid = this._selectedWarehouseId();
    const all = (this.locationsResource.value() as any[]) ?? [];
    if (!wid) return [];
    return all.filter(l => (l.warehouseId?._id ?? l.warehouseId) === wid);
  });

  protected loading = computed(
    () => this.settingsResource.isLoading() || this.warehousesResource.isLoading()
  );

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (raw) {
        const warehouseData = (raw as any).defaultWarehouseId;
        const locationData = (raw as any).defaultLocationId;
        const warehouseId = warehouseData?._id ?? warehouseData ?? null;
        const locationId = locationData?._id ?? locationData ?? null;
        this._selectedWarehouseId.set(warehouseId);
        this.formService.patchValue({
          defaultWarehouseId: warehouseId,
          defaultLocationId: locationId,
        });
        this.formService.resetDirtyState();
      }
    });
  }

  onWarehouseChange(warehouseId: string | null) {
    this._selectedWarehouseId.set(warehouseId);
    this.formService.patchValue({ defaultLocationId: null });
  }

  handleSubmit(data: FormValueState<InventorySettingsFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const payload: Record<string, any> = {
      defaultWarehouseId: rawValue.defaultWarehouseId || null,
      defaultLocationId: rawValue.defaultLocationId || null,
    };

    this.crudInventorySettings
      .putSettings(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.settingsResource.reload();
        },
        error: () => this.isSubmitLoading.set(false),
      });
  }
}
