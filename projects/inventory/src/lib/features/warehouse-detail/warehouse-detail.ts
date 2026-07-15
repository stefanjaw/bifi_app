import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { CrudLocations } from '../../services/crud-locations';
import { CrudStockBalances } from '../../services/crud-stock-balances';
import { stockBalance } from '../../interfaces/stock-balance';
import { location } from '../../interfaces/location';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-warehouse-detail',
  host: {
    class: 'flex flex-col gap-4 p-6 ms-4 me-4',
  },
  imports: [ButtonModule, RouterLink, CurrencyPipe, ToastModule, CardModule, TranslatePipe],
  templateUrl: './warehouse-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseDetail {
  private crudWarehouses = inject(CrudWarehouses);
  private crudLocations = inject(CrudLocations);
  private crudStockBalances = inject(CrudStockBalances);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  warehouseResource = this.crudWarehouses.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  locationsResource = this.crudLocations.get({});
  balancesResource = this.crudStockBalances.get({});

  warehouse = this.warehouseResource.value;
  isLoading = this.warehouseResource.isLoading;

  locations = computed(() => {
    const locs = (this.locationsResource.value() as location[]) ?? [];
    return locs.filter(l => l.warehouseId?._id === this.id());
  });

  stockValue = computed(() => {
    const balances = (this.balancesResource.value() as stockBalance[]) ?? [];
    return balances
      .filter(b => b.warehouseId?._id === this.id())
      .reduce((sum, b) => sum + b.quantity * (b.productId?.costPrice ?? 0), 0);
  });

  deactivating = signal<string | null>(null);

  deactivateLocation(loc: location) {
    this.deactivating.set(loc._id);
    this.crudLocations
      .put({ _id: loc._id, data: { active: false } as any })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.deactivating.set(null);
          this.locationsResource.reload();
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('locationDeactivated', {}, 'inventory'),
          });
        },
        error: () => {
          this.deactivating.set(null);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('error', {}, 'inventory'),
            detail: this.translationService.translate(
              'couldNotDeactivateLocation',
              {},
              'inventory'
            ),
          });
        },
      });
  }
}
