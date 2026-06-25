import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProductTypes } from '../../services/crud-product-types';
import { productType } from '../../interfaces/product-type';
import { productTypeColumns } from '../../libraries/product-type-columns';
import { productTypeFilters } from '../../libraries/product-type-filters';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-product-types-list',
  providers: [provideResourceManager(CrudProductTypes)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, HasPermission, ButtonsActions],
  templateUrl: './product-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTypesList {
  private resourceManager = inject<ResourceManager<productType>>(ResourceManager);
  private crudProductTypes = inject(CrudProductTypes);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  productTypeColumns = productTypeColumns;
  productTypeFilters = productTypeFilters;

  entries = this.resourceManager.data;

  gotoEditProductType = (element: productType) => {
    this.router.navigate([`/settings/inventory/product-types/${element._id}/edit`]);
  };

  delete(id: string) {
    this.crudProductTypes
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.entries.reload() });
  }
}
