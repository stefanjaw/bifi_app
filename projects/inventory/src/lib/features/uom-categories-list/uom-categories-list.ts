import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudUomCategories } from '../../services/crud-uom-categories';
import { uomCategory } from '../../interfaces/uom-category';
import { uomCategoryColumns } from '../../libraries/uom-category-columns';
import { uomCategoryFilters } from '../../libraries/uom-category-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-uom-categories-list',
  providers: [provideResourceManager(CrudUomCategories)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink],
  templateUrl: './uom-categories-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UomCategoriesList {
  private resourceManager = inject<ResourceManager<uomCategory>>(ResourceManager);
  private crudUomCategories = inject(CrudUomCategories);
  private destroy$ = inject(DestroyRef);

  uomCategoryColumns = uomCategoryColumns;
  uomCategoryFilters = uomCategoryFilters;

  entries = this.resourceManager.data;

  delete(id: string) {
    this.crudUomCategories
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.entries.reload() });
  }
}
