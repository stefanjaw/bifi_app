import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { lineItem } from '../../interfaces/line-item';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'bifi-app-line-items-table',
  imports: [ButtonModule, InputTextModule, InputNumberModule, FormsModule, CurrencyPipe],
  templateUrl: './line-items-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemsTable {
  items = input<lineItem[]>([]);
  itemsChange = output<lineItem[]>();
  readonly = input<boolean>(false);

  internalItems = signal<lineItem[]>([]);

  constructor() {
    const syncEffect = () => {
      const incoming = this.items();
      if (incoming && incoming.length > 0 && this.internalItems().length === 0) {
        this.internalItems.set(incoming.map(i => ({ ...i })));
      }
    };
  }

  ngOnInit() {
    const incoming = this.items();
    if (incoming && incoming.length > 0) {
      this.internalItems.set(incoming.map(i => ({ ...i })));
    }
  }

  grandTotal = computed(() =>
    this.internalItems().reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  );

  addItem() {
    this.internalItems.update(items => [
      ...items,
      { description: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);
    this.emit();
  }

  removeItem(index: number) {
    this.internalItems.update(items => items.filter((_, i) => i !== index));
    this.emit();
  }

  updateItem(index: number, field: keyof lineItem, value: string | number) {
    this.internalItems.update(items => {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: value };
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
      return updated;
    });
    this.emit();
  }

  private emit() {
    this.itemsChange.emit(this.internalItems());
  }
}
