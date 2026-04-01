import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudExchangeRates } from '../../services/crud-exchange-rates';
import { exchangeRateColumns } from '../../libraries/exchange-rate-columns';
import { exchangeRateFilters } from '../../libraries/exchange-rate-filters';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { exchangeRate } from '../../interfaces/exchange-rate';

@Component({
  selector: 'bifi-app-exchange-rates-list',
  providers: [provideResourceManager(CrudExchangeRates)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink, ButtonsActions],  templateUrl: './exchange-rates-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRatesList {
  private resourceManager = inject<ResourceManager<exchangeRate>>(ResourceManager);
  private crudExchangeRates = inject(CrudExchangeRates);
  private destroy$ = inject(DestroyRef);

  // Router
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  exchangeRateColumns = exchangeRateColumns;
  exchangeRateFilters = exchangeRateFilters;

  exchangeRates = this.resourceManager.data;

  goToEditExchangeRate = (element: exchangeRate) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
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
