import {
  ChangeDetectionStrategy,
  Component,
  computed,
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

  internalItems = signal<lineItem[]>([]);

  ngOnInit() {
    const incoming = this.items();
    if (incoming && incoming.length > 0) {
      this.internalItems.set(incoming.map(i => ({ ...i })));
    }
  }

  grandTotal = computed(() =>
    this.internalItems().reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
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

  updateItem(index: number, field: keyof lineItem, value: string | number | string[]) {
    this.internalItems.update(items => {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updated[index].total = updated[index].quantity * updated[index].unitPrice;
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

  getLineTaxPerUnit(index: number): number {
    const item = this.internalItems()[index];
    if (!item) return 0;
    return Number(((item.unitPrice ?? 0) * this.getLineTaxRateSum(index)).toFixed(2));
  }

  getLineGrossTotal(index: number): number {
    const item = this.internalItems()[index];
    if (!item) return 0;
    const taxPerUnit = this.getLineTaxPerUnit(index);
    return Number(((item.quantity ?? 0) * ((item.unitPrice ?? 0) + taxPerUnit)).toFixed(2));
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

  getProductName(index: number): string {
    const productId = this.internalItems()[index]?.productId;
    if (!productId) return '—';
    const prod = this.productOptions().find((p: any) => p._id === productId);
    return prod ? `[${prod.sku}] ${prod.name}` : productId;
  }

  private emit() {
    this.itemsChange.emit(this.internalItems());
  }
}
