import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CrudCurrencies } from '../../services/crud-currencies';
import { currencyColumns } from '../../libraries/currency-columns';
import { currencyFilters } from '../../libraries/currency-filters';
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
import { currency } from '../../interfaces/currency';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { DebugMode } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-currencies-list',
  providers: [provideResourceManager(CrudCurrencies)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    RouterLink,
    ButtonsActions,
    TranslatePipe,
    DebugMode,
  ],
  templateUrl: './currencies-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesList {
  private resourceManager = inject<ResourceManager<currency>>(ResourceManager);
  private crudCurrencies = inject(CrudCurrencies);
  private destroy$ = inject(DestroyRef);

  //router
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  currencyColumns = currencyColumns;
  currencyFilters = currencyFilters;

  currencies = this.resourceManager.data;
  populationLoading = signal(false);

  goToEditCurrency = (element: currency) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
  populateCurrencies() {
    this.populationLoading.set(true);
    this.crudCurrencies
      .post({
        data: {},
        specificEndpoint: 'populate',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.currencies.reload();
          this.populationLoading.set(false);
        },
        error: () => this.populationLoading.set(false),
      });
  }
  deleteCurrency(id: string) {
    this.crudCurrencies
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.currencies.reload();
        },
      });
  }
}
