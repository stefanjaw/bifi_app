import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudMovements } from '../../services/crud-movements';
import { CrudProducts } from '../../services/crud-products';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { CrudLocations } from '../../services/crud-locations';
import { location } from '../../interfaces/location';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MovementFormService, MovementFormModel } from '../../services/movement-form';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import { product } from '../../interfaces/product';

@Component({
  selector: 'bifi-app-movement-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ProgressBarModule,
    RouterLink,
    HasPermission,
    TranslatePipe,
  ],
  templateUrl: './movement-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementForm {
  protected formService = inject(MovementFormService);
  private crudMovements = inject(CrudMovements);
  private crudProducts = inject(CrudProducts);
  private crudWarehouses = inject(CrudWarehouses);
  private crudLocations = inject(CrudLocations);
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private destroy$ = inject(DestroyRef);

  form = this.formService.form;
  selectedWarehouseId = this.formService.selectedWarehouseId;

  isSubmitLoading = signal(false);

  movementTypes = computed(() => [
    { label: this.translationService.translate('stockIn', {}, 'inventory'), value: 'IN' },
    { label: this.translationService.translate('stockOut', {}, 'inventory'), value: 'OUT' },
    {
      label: this.translationService.translate('adjustment', {}, 'inventory'),
      value: 'ADJUSTMENT',
    },
  ]);

  adjustmentDirections = computed(() => [
    {
      label: this.translationService.translate('adjustmentIncrease', {}, 'inventory'),
      value: 'INCREASE',
    },
    {
      label: this.translationService.translate('adjustmentDecrease', {}, 'inventory'),
      value: 'DECREASE',
    },
  ]);

  protected selectedType = toSignal(this.formService.form.controls.type.valueChanges, {
    initialValue: 'IN',
  });

  protected selectedDirection = toSignal(
    this.formService.form.controls.adjustmentDirection.valueChanges,
    { initialValue: null }
  );

  private selectedProductId = toSignal(this.formService.form.controls.productId.valueChanges, {
    initialValue: '',
  });

  /** Unit cost is only user-definable when the movement adds stock (IN or ADJUSTMENT/INCREASE); decreases consume at the current average */
  showUnitCost = computed(
    () =>
      this.selectedType() === 'IN' ||
      (this.selectedType() === 'ADJUSTMENT' && this.selectedDirection() === 'INCREASE')
  );

  constructor() {
    effect(() => {
      const type = this.selectedType();
      if (type === 'ADJUSTMENT') {
        if (!this.selectedDirection()) {
          this.formService.form.controls.adjustmentDirection.setValue('INCREASE');
        }
      } else if (this.formService.form.controls.adjustmentDirection.value) {
        this.formService.form.controls.adjustmentDirection.setValue(null);
      }
    });

    effect(() => {
      const selectedId = this.selectedProductId();
      const products = (this.products() ?? []) as product[];
      if (!selectedId || products.length === 0) {
        return;
      }
      const matched = products.find(p => p._id === selectedId);
      if (!matched) {
        return;
      }
      this.formService.form.controls.unitCost.setValue(matched.costPrice ?? 0, {
        emitEvent: false,
      });
    });
  }

  productsResource = this.crudProducts.get({});
  warehousesResource = this.crudWarehouses.get({});
  locationsResource = this.crudLocations.get({});

  isLoading = computed(
    () =>
      this.productsResource.isLoading() ||
      this.warehousesResource.isLoading() ||
      this.locationsResource.isLoading()
  );

  products = this.productsResource.value;
  warehouses = this.warehousesResource.value;
  allLocations = this.locationsResource.value;

  filteredLocations = computed(() =>
    ((this.allLocations() as location[]) ?? []).filter(
      l => l.warehouseId?._id === this.formService.selectedWarehouseId()
    )
  );

  handleSubmit(data: FormValueState<MovementFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    this.crudMovements
      .post({ data: rawValue as any })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.goBack();
        },
        error: () => this.isSubmitLoading.set(false),
      });
  }

  goBack() {
    this.router.navigate(['/inventory/movements']);
  }
}
