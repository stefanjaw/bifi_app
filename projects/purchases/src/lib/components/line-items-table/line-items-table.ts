import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { lineItem } from '../../interfaces/line-item';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ColWidthManager } from '@avalantec/base-app/core';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';

const DEFAULT_WIDTHS: Record<string, number> = {
  sku: 96,
  description: 280,
  quantity: 80,
  uom: 72,
  unitPrice: 128,
  discount: 128,
  taxes: 160,
  total: 112,
};

@Component({
  selector: 'bifi-app-line-items-table',
  imports: [
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    MultiSelectModule,
    FormsModule,
    CurrencyPipe,
    HasPermission,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    TranslatePipe,
  ],
  templateUrl: './line-items-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemsTable implements OnInit {
  items = input<lineItem[]>([]);
  itemsChange = output<lineItem[]>();
  readonly = input<boolean>(false);
  productOptions = input<any[]>([]);
  taxOptions = input<any[]>([]);
  discountOptions = input<any[]>([]);

  internalItems = signal<lineItem[]>([]);

  private cwm = new ColWidthManager(DEFAULT_WIDTHS, 'lineItems.purchases.colWidths');
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

  ngOnInit() {
    const incoming = this.items();
    if (incoming && incoming.length > 0) {
      this.internalItems.set(incoming.map(i => ({ ...i })));
    }
  }

  grandTotal = computed(() =>
    this.internalItems().reduce((sum, item) => {
      const discountedPrice = this._applyDiscount(item.unitPrice ?? 0, item.discountId);
      return sum + (item.quantity ?? 0) * discountedPrice;
    }, 0)
  );

  addItem() {
    this.internalItems.update(items => [
      ...items,
      { description: '', quantity: 1, unitPrice: 0, total: 0, taxIds: [] },
    ]);
    this.emit();
  }

  removeItem(index: number) {
    this.internalItems.update(items => items.filter((_, i) => i !== index));
    this.emit();
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.internalItems.update(items => {
        const next = [...items];
        moveItemInArray(next, event.previousIndex, event.currentIndex);
        return next;
      });
      this.emit();
    }
  }

  updateItem(index: number, field: keyof lineItem, value: string | number | string[]) {
    this.internalItems.update(items => {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice' || field === 'discountId') {
        const item = updated[index];
        const discountedPrice = this._applyDiscount(item.unitPrice ?? 0, item.discountId);
        updated[index].total = (item.quantity ?? 0) * discountedPrice;
      }
      return updated;
    });
    this.emit();
  }

  onProductChange(index: number, productId: string) {
    const prod = this.productOptions().find((p: any) => p._id === productId);
    if (!prod) return;
    const rawTaxIds: any[] = Array.isArray(prod.defaultPurchaseTaxIds)
      ? prod.defaultPurchaseTaxIds
      : [];
    const taxIds: string[] = rawTaxIds
      .map((id: any) => {
        if (!id) return '';
        if (typeof id === 'string') return id;
        if (typeof id === 'object') return (id._id ?? id.$oid ?? '').toString();
        return String(id);
      })
      .filter(Boolean);

    this.internalItems.update(items => {
      const updated = [...items];
      const qty = updated[index].quantity ?? 1;
      updated[index] = {
        ...updated[index],
        productId,
        description: prod.description ?? prod.name ?? '',
        unitPrice: prod.costPrice ?? 0,
        total: qty * (prod.costPrice ?? 0),
        taxIds,
      };
      return updated;
    });

    this.emit();
  }

  onLineTaxChange(index: number, value: string[] | null) {
    this.internalItems.update(items => {
      const updated = [...items];
      updated[index] = { ...updated[index], taxIds: value ?? [] };
      return updated;
    });
    this.emit();
  }

  getLineTaxIds(index: number): string[] {
    return this.internalItems()[index]?.taxIds ?? [];
  }

  getLineTaxRateSum(index: number): number {
    const ids = this.getLineTaxIds(index);
    return ids.reduce((sum, id) => {
      const tax = this.taxOptions().find((t: any) => t._id === id);
      return sum + (tax?.percentage ?? 0) / 100;
    }, 0);
  }

  getDiscountedUnitPrice(index: number): number {
    const item = this.internalItems()[index];
    if (!item) return 0;
    return this._applyDiscount(item.unitPrice ?? 0, item.discountId);
  }

  getDiscount(index: number): any {
    const discountId = this.internalItems()[index]?.discountId;
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
    const item = this.internalItems()[index];
    if (!item) return 0;
    const discountedPrice = this.getDiscountedUnitPrice(index);
    const taxPerUnit = this.getLineTaxPerUnit(index);
    return Number(((item.quantity ?? 0) * (discountedPrice + taxPerUnit)).toFixed(2));
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

  getProductSku(index: number): string {
    const productId = this.internalItems()[index]?.productId;
    if (!productId) return '—';
    const prod = this.productOptions().find((p: any) => p._id === productId);
    return prod?.sku ?? '—';
  }

  getProductName(index: number): string {
    const productId = this.internalItems()[index]?.productId;
    if (!productId) return '—';
    const prod = this.productOptions().find((p: any) => p._id === productId);
    return prod ? `[${prod.sku}] ${prod.name}` : productId;
  }

  getUom(index: number): string {
    const productId = this.internalItems()[index]?.productId;
    if (!productId) return '—';
    const prod = this.productOptions().find((p: any) => p._id === productId);
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

  private emit() {
    this.itemsChange.emit(this.internalItems());
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
