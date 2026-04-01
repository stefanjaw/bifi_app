import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProducts } from '../../services/crud-products';
import { product } from '../../interfaces/product';
import { productColumns } from '../../libraries/product-columns';
import { productFilters } from '../../libraries/product-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-products-list',
  providers: [provideResourceManager(CrudProducts)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, HasPermission],
  templateUrl: './products-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsList {
  private resourceManager = inject<ResourceManager<product>>(ResourceManager);
  private crudProducts = inject(CrudProducts);
  private destroy$ = inject(DestroyRef);

  productColumns = productColumns;
  productFilters = productFilters;
  entries = this.resourceManager.data;

  delete(id: string) {
    this.crudProducts
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.entries.reload() });
  }
}
