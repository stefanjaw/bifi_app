import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnDestroy,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { FilterManager } from '../../services/filter-manager';
import { filter } from '../../interfaces/filter';

@Component({
  selector: 'bifi-app-search-bar',
  imports: [
    MatInput,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatLabel,
    FormsModule,
  ],
  host: { class: 'w-full' },
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar implements OnDestroy {
  searchText = model<string>('');
  filterManager = inject(FilterManager);
  searchFilters = input<filter<any>[]>([]);
  label = input<string>('Search');

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
    this.filterManager.clearFilters();

    if (this.searchText()) {
      this.filterManager.addFilters(
        this.searchFilters()
          .filter((filter) => filter.type === 'string')
          .map((filter) => ({
            ...filter,
            value: this.searchText(),
            operator: 'like',
          })),
      );
    }
  }
}
