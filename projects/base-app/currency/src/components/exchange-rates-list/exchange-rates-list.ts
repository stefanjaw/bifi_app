import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudExchangeRates } from '../../services/crud-exchange-rates';
import { exchangeRateColumns } from '../../libraries/exchange-rate-columns';
import { exchangeRateFilters } from '../../libraries/exchange-rate-filters';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { exchangeRate } from '../../interfaces/exchange-rate';

@Component({
  selector: 'bifi-app-exchange-rates-list',
  providers: [provideResourceManager(CrudExchangeRates)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './exchange-rates-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRatesList {
  private resourceManager = inject<ResourceManager<exchangeRate>>(ResourceManager);
  private crudExchangeRates = inject(CrudExchangeRates);
  private destroy$ = inject(DestroyRef);

  exchangeRateColumns = exchangeRateColumns;
  exchangeRateFilters = exchangeRateFilters;

  exchangeRates = this.resourceManager.data;

  deleteExchangeRate(id: string) {
    this.crudExchangeRates
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.exchangeRates.reload();
        },
      });
  }
}
