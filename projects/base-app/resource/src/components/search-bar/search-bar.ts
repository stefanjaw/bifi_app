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
import { ListStateManager } from '../../services/list-state-manager';
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
  private listStateManager = inject(ListStateManager);

  // inputs
  searchFilters = input<filter<any>[]>([]);
  label = input<string>('Search');

  // The search text input
  searchText = model<string>('');
  debounce = debouncedSignal({ signal: this.searchText, debounce: this.DEBOUNCE_TIME });

  constructor() {
    // Restore search text from pending state set by ResourceManager on init
    const pending = this.listStateManager.pendingRestore;
    if (pending?.searchText) {
      this.searchText.set(pending.searchText);
    }

    // Perform the search whenever the debounced value changes
    effect(() => {
      this.performSearch();
    });

    // Keep partialSave up to date so ResourceManager can sync to URL and localStorage
    effect(() => {
      this.listStateManager.savePartialState({ searchText: this.debounce() });
    });
  }

  ngOnDestroy(): void {
    // Save the current (non-debounced) text so it is included in the localStorage snapshot
    this.listStateManager.savePartialState({ searchText: this.searchText() });
    // Only remove this component's own filter group — not the entire filter state
    this.filterManager.removeFilter(this.FILTER_ID);
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
