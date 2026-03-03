import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { BaseForm, FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudMovements } from '../../services/crud-movements';
import { CrudProducts } from '../../services/crud-products';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { CrudLocations } from '../../services/crud-locations';
import { location } from '../../interfaces/location';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface MovementFormModel {
  type: string;
  productId: string;
  warehouseId: string;
  locationId: string;
  quantity: number;
  reference: string;
  notes: string;
}

const MOVEMENT_TYPES = [
  { label: 'Stock In (IN)', value: 'IN' },
  { label: 'Stock Out (OUT)', value: 'OUT' },
  { label: 'Adjustment', value: 'ADJUSTMENT' },
];

@Component({
  selector: 'bifi-app-movement-form',
  imports: [FormModule, ReactiveFormsModule, InputText, InputNumberModule, SelectModule, TextareaModule, ProgressBarModule, RouterLink],
  templateUrl: './movement-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementForm extends BaseForm<MovementFormModel> {
  private crudMovements = inject(CrudMovements);
  private crudProducts = inject(CrudProducts);
  private crudWarehouses = inject(CrudWarehouses);
  private crudLocations = inject(CrudLocations);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  isSubmitLoading = signal(false);
  movementTypes = MOVEMENT_TYPES;

  productsResource = this.crudProducts.get({});
  warehousesResource = this.crudWarehouses.get({});
  locationsResource = this.crudLocations.get({});

  isLoading = computed(() =>
    this.productsResource.isLoading() ||
    this.warehousesResource.isLoading() ||
    this.locationsResource.isLoading()
  );

  products = this.productsResource.value;
  warehouses = this.warehousesResource.value;
  allLocations = this.locationsResource.value;

  selectedWarehouseId = signal<string>('');

  filteredLocations = computed(() =>
    (this.allLocations() as location[] ?? []).filter(l => l.warehouseId?._id === this.selectedWarehouseId())
  );

  override createForm() {
    return this.fb.group<MovementFormModel>({
      type: ['IN', [Validators.required]],
      productId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      locationId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reference: [''],
      notes: [''],
    });
  }

  constructor() {
    super();
    this.form.get('warehouseId')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(wid => {
        this.selectedWarehouseId.set(wid ?? '');
        this.form.patchValue({ locationId: '' }, { emitEvent: false });
      });
  }

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
