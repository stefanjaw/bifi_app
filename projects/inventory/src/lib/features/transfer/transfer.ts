import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { CrudProducts } from '../../services/crud-products';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { CrudLocations } from '../../services/crud-locations';
import { CrudStockBalances } from '../../services/crud-stock-balances';
import { TransferService } from '../../services/transfer';
import { product } from '../../interfaces/product';
import { warehouse } from '../../interfaces/warehouse';
import { location } from '../../interfaces/location';
import { stockBalance } from '../../interfaces/stock-balance';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-transfer',
  host: {
    class: 'flex flex-col gap-2',
  },
  imports: [
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './transfer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transfer {
  private fb = inject(FormBuilder);
  private crudProducts = inject(CrudProducts);
  private crudWarehouses = inject(CrudWarehouses);
  private crudLocations = inject(CrudLocations);
  private crudStockBalances = inject(CrudStockBalances);
  private transferService = inject(TransferService);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  isSubmitLoading = signal(false);

  productsResource = this.crudProducts.get({});
  warehousesResource = this.crudWarehouses.get({});
  locationsResource = this.crudLocations.get({});

  products = computed(() => (this.productsResource.value() as product[]) ?? []);
  warehouses = computed(() => (this.warehousesResource.value() as warehouse[]) ?? []);
  allLocations = computed(() => (this.locationsResource.value() as location[]) ?? []);

  selectedProductId = signal<string>('');
  selectedFromWarehouseId = signal<string>('');
  selectedFromLocationId = signal<string>('');
  selectedToWarehouseId = signal<string>('');

  fromLocations = computed(() =>
    this.allLocations().filter(l => l.warehouseId?._id === this.selectedFromWarehouseId())
  );

  toLocations = computed(() =>
    this.allLocations().filter(
      l =>
        l.warehouseId?._id === this.selectedToWarehouseId() &&
        l._id !== this.selectedFromLocationId()
    )
  );

  private balanceResource = this.crudStockBalances.get({
    searchParams: computed(() => {
      const p = this.selectedProductId();
      const w = this.selectedFromWarehouseId();
      const l = this.selectedFromLocationId();
      return p && w && l ? { productId: p, warehouseId: w, locationId: l } : {};
    }),
  });

  availableQuantity = computed(() => {
    const balances = (this.balanceResource.value() as stockBalance[]) ?? [];
    return balances.length > 0 ? balances[0].quantity : null;
  });

  form = this.fb.group({
    productId: ['', [Validators.required]],
    fromWarehouseId: ['', [Validators.required]],
    fromLocationId: ['', [Validators.required]],
    toWarehouseId: ['', [Validators.required]],
    toLocationId: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reference: [''],
    notes: [''],
  });

  constructor() {
    this.form
      .get('productId')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(pid => this.selectedProductId.set(pid ?? ''));

    this.form
      .get('fromWarehouseId')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(wid => {
        this.selectedFromWarehouseId.set(wid ?? '');
        this.form.patchValue({ fromLocationId: '' }, { emitEvent: false });
        this.selectedFromLocationId.set('');
      });

    this.form
      .get('fromLocationId')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(lid => {
        this.selectedFromLocationId.set(lid ?? '');
        const toLocation = this.form.get('toLocationId')!.value;
        if (toLocation && toLocation === lid) {
          this.form.patchValue({ toLocationId: '' }, { emitEvent: false });
        }
      });

    this.form
      .get('toWarehouseId')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(wid => {
        this.selectedToWarehouseId.set(wid ?? '');
        this.form.patchValue({ toLocationId: '' }, { emitEvent: false });
      });

    effect(() => {
      const qty = this.availableQuantity();
      const ctrl = this.form.get('quantity')!;
      ctrl.setValidators([
        Validators.required,
        Validators.min(1),
        ...(qty !== null ? [Validators.max(qty)] : []),
      ]);
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    this.isSubmitLoading.set(true);
    this.transferService
      .transfer({
        productId: v.productId!,
        fromWarehouseId: v.fromWarehouseId!,
        fromLocationId: v.fromLocationId!,
        toWarehouseId: v.toWarehouseId!,
        toLocationId: v.toLocationId!,
        quantity: v.quantity!,
        reference: v.reference ?? undefined,
        notes: v.notes ?? undefined,
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.form.reset({ quantity: 1 });
          this.selectedProductId.set('');
          this.selectedFromWarehouseId.set('');
          this.selectedFromLocationId.set('');
          this.selectedToWarehouseId.set('');
        },
        error: () => this.isSubmitLoading.set(false),
      });
  }

  goBack() {
    this.router.navigate(['/inventory/movements']);
  }
}
