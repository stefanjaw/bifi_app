import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterManager } from '../../services/filter-manager';
import { filter } from '../../interfaces/filter';
import { IconFieldModule } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { InputIcon } from 'primeng/inputicon';
import { debouncedSignal } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-search-bar',
  imports: [FormsModule, IconFieldModule, InputText, InputIcon],
  host: { class: 'w-full' },
  templateUrl: './search-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar implements OnDestroy {
  private readonly FILTER_ID = 'search-bar';
  private readonly DEBOUNCE_TIME = 500;

  private destroy$ = inject(DestroyRef);
  filterManager = inject(FilterManager);

  // inputs
  searchFilters = input<filter<any>[]>([]);
  label = input<string>('Search');

  // The search text input
  searchText = model<string>('');
  debounce = debouncedSignal({ signal: this.searchText, debounce: this.DEBOUNCE_TIME });

  constructor() {
    effect(() => {
      // Whenever the search text changes, we perform the search
      this.performSearch();
    });
  }

  ngOnDestroy(): void {
    this.filterManager.clearFilters();
  }

  /**
   * When the search bar is submitted, either by pressing enter or clicking the
   * search button, this function will be called. If the search bar is not empty,
   * it will add a filter for each search filter that is a string type, and set
   * the operator to 'like'. If the search bar is empty, it will clear all filters.
   */
  performSearch() {
    this.filterManager.removeFilter(this.FILTER_ID);

    if (this.debounce()) {
      this.filterManager.addFilter({
        id: this.FILTER_ID,
        operator: 'or',
        filters: this.searchFilters()
          .filter(filter => filter.type === 'string')
          .map(filter => ({
            ...filter,
            value: this.debounce(),
            operator: 'like',
          })),
      });
    }
  }
}
