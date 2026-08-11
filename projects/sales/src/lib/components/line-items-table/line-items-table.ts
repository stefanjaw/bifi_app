import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { product } from '@avalantec/inventory';
import { SalesOrderForm } from '../../services/sales-order-form';
import { ColWidthManager } from '@avalantec/base-app/core';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';

const DEFAULT_WIDTHS: Record<string, number> = {
  sku: 150,
  description: 320,
  quantity: 160,
  uom: 100,
  unitPrice: 150,
  discount: 150,
  taxes: 240,
  total: 140,
};

@Component({
  selector: 'bifi-app-line-items-table',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    MultiSelectModule,
    DecimalPipe,
    HasPermission,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    TranslatePipe,
  ],
  templateUrl: './line-items-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemsTable {
  private formService = inject(SalesOrderForm);

  productOptions = input<product[]>([]);
  taxOptions = input<any[]>([]);
  discountOptions = input<any[]>([]);
  stockMap = input<Record<string, number>>({});
  readonly = input<boolean>(false);

  private cwm = new ColWidthManager(DEFAULT_WIDTHS, 'lineItems.sales.colWidths');
  colWidths = this.cwm.colWidths;

  onResizeStart(event: MouseEvent, colKey: string) {
    this.cwm.onResizeStart(event, colKey);
  }

  @HostListener('document:mousemove', ['$event'])
  onResizeMove(event: MouseEvent) {
    this.cwm.onResizeMove(event);
  }

  @HostListener('document:mouseup')
  onResizeEnd() {
    this.cwm.onResizeEnd();
  }

  get lineItemsArray() {
    return this.formService.lineItemsArray;
  }

  get lineTaxIds() {
    return this.formService.lineTaxIds;
  }

  private lineItemValues = toSignal(
    this.formService.lineItemsArray.valueChanges.pipe(
      startWith(this.formService.lineItemsArray.value)
    ),
    { initialValue: this.formService.lineItemsArray.value }
  );

  grandTotal = computed(() =>
    (this.lineItemValues() as any[]).reduce((sum, item) => {
      const discountedPrice = this._applyDiscount(item?.unitPrice ?? 0, item?.discountId);
      return sum + (item?.quantity ?? 0) * discountedPrice;
    }, 0)
  );

  addItem() {
    this.formService.addLineItem();
  }

  removeItem(index: number) {
    this.formService.removeLineItem(index);
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.formService.moveLineItem(event.previousIndex, event.currentIndex);
    }
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
      const rawTaxIds: any[] = Array.isArray(prod.defaultSaleTaxIds) ? prod.defaultSaleTaxIds : [];
      const taxIds: string[] = rawTaxIds
        .map((id: any) => {
          if (!id) return '';
          if (typeof id === 'string') return id;
          if (typeof id === 'object') return (id._id ?? id.$oid ?? '').toString();
          return String(id);
        })
        .filter(Boolean);
      this.formService.setLineTaxIds(index, taxIds);
    }
  }

  onLineTaxChange(index: number, value: string[] | null) {
    this.formService.setLineTaxIds(index, value ?? []);
  }

  getLineTaxIds(index: number): string[] {
    return this.lineTaxIds()[index] ?? [];
  }

  getLineTaxRateSum(index: number): number {
    const ids = this.getLineTaxIds(index);
    return ids.reduce((sum, id) => {
      const tax = this.taxOptions().find((t: any) => t._id === id);
      return sum + (tax?.percentage ?? 0) / 100;
    }, 0);
  }

  getDiscountedUnitPrice(index: number): number {
    const control = this.lineItemsArray.controls[index] as FormGroup;
    const unitPrice = (control?.get('unitPrice')?.value as number) ?? 0;
    const discountId = control?.get('discountId')?.value as string;
    return this._applyDiscount(unitPrice, discountId);
  }

  getDiscount(index: number): any {
    const control = this.lineItemsArray.controls[index] as FormGroup;
    const discountId = control?.get('discountId')?.value as string;
    if (!discountId) return null;
    return this.discountOptions().find((d: any) => d._id === discountId) ?? null;
  }

  getDiscountLabel(index: number): string {
    const discount = this.getDiscount(index);
    if (!discount) return '—';
    return discount.name;
  }

  getLineTaxPerUnit(index: number): number {
    const discountedPrice = this.getDiscountedUnitPrice(index);
    return Number((discountedPrice * this.getLineTaxRateSum(index)).toFixed(2));
  }

  getLineGrossTotal(index: number): number {
    const control = this.lineItemsArray.controls[index] as FormGroup;
    const qty = (control?.get('quantity')?.value as number) ?? 0;
    const discountedPrice = this.getDiscountedUnitPrice(index);
    const taxPerUnit = this.getLineTaxPerUnit(index);
    return Number((qty * (discountedPrice + taxPerUnit)).toFixed(2));
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
    const uom = prod.unitOfMeasureId as any;
    if (uom && typeof uom === 'object') {
      const symbol = (uom.symbol ?? '').toString().trim();
      if (symbol) return symbol;
      const name = (uom.name ?? '').toString().trim();
      if (name) return name;
    }
    return '—';
  }

  getProductSku(index: number): string {
    const productId = (this.lineItemsArray.controls[index] as FormGroup).get('productId')?.value;
    if (!productId) return '—';
    const prod = this.productOptions().find(p => p._id === productId);
    return prod?.sku ?? '—';
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

  getAppliedTaxLabels(index: number): string {
    const ids = this.getLineTaxIds(index);
    if (!ids.length) return '—';
    return ids
      .map(id => {
        const tax = this.taxOptions().find((t: any) => t._id === id);
        return tax ? `${tax.name} (${tax.percentage}%)` : id;
      })
      .join(', ');
  }

  private _applyDiscount(unitPrice: number, discountId: string | null | undefined): number {
    if (!discountId) return unitPrice;
    const discount = this.discountOptions().find((d: any) => d._id === discountId);
    if (!discount) return unitPrice;
    return discount.discountType === 'percentage'
      ? unitPrice * (1 - discount.value / 100)
      : Math.max(0, unitPrice - discount.value);
  }
}
