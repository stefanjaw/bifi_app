import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
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

@Component({
  selector: 'bifi-app-currencies-list',
  providers: [provideResourceManager(CrudCurrencies)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink, ButtonsActions],  templateUrl: './currencies-list.html',
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

  goToEditCurrency = (element: currency) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
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
