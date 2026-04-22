import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { product } from '@avalantec/inventory';
import { SalesOrderForm } from '../../services/sales-order-form';

@Component({
  selector: 'bifi-app-line-items-table',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CurrencyPipe,
  ],
  templateUrl: './line-items-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemsTable {
  private formService = inject(SalesOrderForm);

  productOptions = input<product[]>([]);
  stockMap = input<Record<string, number>>({});
  readonly = input<boolean>(false);

  get lineItemsArray() {
    return this.formService.lineItemsArray;
  }

  private lineItemValues = toSignal(
    this.formService.lineItemsArray.valueChanges.pipe(
      startWith(this.formService.lineItemsArray.value)
    ),
    { initialValue: this.formService.lineItemsArray.value }
  );

  grandTotal = computed(() =>
    (this.lineItemValues() as any[]).reduce(
      (sum, item) => sum + ((item?.quantity ?? 0) * (item?.unitPrice ?? 0)),
      0
    )
  );

  addItem() {
    this.formService.addLineItem();
  }

  removeItem(index: number) {
    this.formService.removeLineItem(index);
  }

  onProductChange(index: number, productId: string) {
    const prod = this.productOptions().find(p => p._id === productId);
    const control = this.lineItemsArray.controls[index] as FormGroup;
    if (prod) {
      const qty = (control.get('quantity')?.value as number) ?? 1;
      control.patchValue({
        description: prod.description ?? prod.name,
        unitPrice: prod.salePrice,
        total: qty * prod.salePrice,
      });
    }
  }

  onQuantityChange(index: number, newQty: number | null) {
    const qty = newQty ?? 0;
    const control = this.lineItemsArray.controls[index] as FormGroup;
    const unitPrice = (control.get('unitPrice')?.value as number) ?? 0;
    control.patchValue({ total: qty * unitPrice });
  }

  onUnitPriceChange(index: number, newPrice: number | null) {
    const price = newPrice ?? 0;
    const control = this.lineItemsArray.controls[index] as FormGroup;
    const qty = (control.get('quantity')?.value as number) ?? 0;
    control.patchValue({ total: qty * price });
  }

  getUom(index: number): string {
    const productId = (this.lineItemsArray.controls[index] as FormGroup).get('productId')?.value;
    if (!productId) return '—';
    const prod = this.productOptions().find(p => p._id === productId);
    if (!prod) return '—';
    return (prod.unitOfMeasureId as any)?.symbol ?? prod.unit ?? '—';
  }

  getProductName(index: number): string {
    const productId = (this.lineItemsArray.controls[index] as FormGroup).get('productId')?.value;
    if (!productId) return '—';
    const prod = this.productOptions().find(p => p._id === productId);
    return prod ? `[${prod.sku}] ${prod.name}` : productId;
  }

  getAvailableStock(index: number): number {
    const productId = (this.lineItemsArray.controls[index] as FormGroup).get('productId')?.value;
    if (!productId) return 0;
    return this.stockMap()[productId] ?? 0;
  }

  isOverStock(index: number): boolean {
    const control = this.lineItemsArray.controls[index] as FormGroup;
    const productId = control.get('productId')?.value;
    if (!productId) return false;
    const qty = (control.get('quantity')?.value as number) ?? 0;
    const available = this.stockMap()[productId];
    return available !== undefined && qty > available;
  }
}
