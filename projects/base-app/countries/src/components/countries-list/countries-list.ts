import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudCountries } from '../../services/crud-countries';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { countryColumns } from '../../libraries/countries-columns';
import { countryFilters } from '../../libraries/countries-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { country } from '@avalantec/base-app/interfaces';
import { DebugMode } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-countries-list',
  providers: [provideResourceManager(CrudCountries)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission, DebugMode],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './countries-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesList {
  private resourceManager = inject<ResourceManager<country>>(ResourceManager);
  private crudCountries = inject(CrudCountries);
  private destroy$ = inject(DestroyRef);

  countryColumns = countryColumns;
  countryFilters = countryFilters;

  countries = this.resourceManager.data;
  populationLoading = signal(false);

  populateCountries() {
    this.populationLoading.set(true);
    this.crudCountries
      .post({
        data: {},
        specificEndpoint: 'populate',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.countries.reload();
          this.populationLoading.set(false);
        },
        error: () => this.populationLoading.set(false),
      });
  }

  deleteCountry(id: string) {
    this.crudCountries
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.countries.reload();
        },
      });
  }
}
