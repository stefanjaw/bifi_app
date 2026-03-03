import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CrudProducts } from '../../services/crud-products';
import { CrudStockBalances } from '../../services/crud-stock-balances';
import { CrudMovements } from '../../services/crud-movements';
import { stockBalance } from '../../interfaces/stock-balance';
import { stockMovement } from '../../interfaces/stock-movement';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'bifi-app-product-detail',
  host: {
    class: 'flex flex-col gap-4 p-6 ms-4 me-4',
  },
  imports: [ButtonModule, RouterLink, CurrencyPipe, CardModule],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private crudProducts = inject(CrudProducts);
  private crudStockBalances = inject(CrudStockBalances);
  private crudMovements = inject(CrudMovements);

  id = input<string>('');

  productResource = this.crudProducts.get({ id: this.id, triggerRequest: computed(() => !!this.id()) });
  balancesResource = this.crudStockBalances.get({});
  movementsResource = this.crudMovements.get({});

  product = this.productResource.value;
  isLoading = this.productResource.isLoading;

  stockBalances = computed(() => {
    const all = (this.balancesResource.value() as stockBalance[]) ?? [];
    return all.filter(b => (b.productId as any)?._id === this.id() || b.productId === this.id() as any);
  });

  totalStock = computed(() =>
    this.stockBalances().reduce((sum, b) => sum + b.quantity, 0)
  );

  stockByWarehouse = computed(() => {
    const map = new Map<string, { name: string; quantity: number }>();
    for (const b of this.stockBalances()) {
      const wid = (b.warehouseId as any)?._id ?? '';
      const wname = (b.warehouseId as any)?.name ?? 'Unknown';
      const prev = map.get(wid) ?? { name: wname, quantity: 0 };
      map.set(wid, { name: wname, quantity: prev.quantity + b.quantity });
    }
    return Array.from(map.values());
  });

  recentMovements = computed(() => {
    const all = (this.movementsResource.value() as stockMovement[]) ?? [];
    return all
      .filter(m => (m.productId as any)?._id === this.id() || m.productId === this.id() as any)
      .slice(0, 20);
  });
}
