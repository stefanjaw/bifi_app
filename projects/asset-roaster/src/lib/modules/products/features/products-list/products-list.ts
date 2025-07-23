import { productFilters } from '../../libraries/product-filters';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { productColumns } from '../../libraries/product-columns';
import { product } from '../../interfaces/product';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { Badge } from '@avalantec/base-app/core';
import { CrudProducts } from '../../services/crud-products';
import { ProductStatusCardComponent } from '../../ui/product-status-card/product-status-card';
import { ProductStatusSelect } from '../../ui/product-status-select/product-status-select';
import { ProductFormDialog } from '../product-form-dialog/product-form-dialog';

@Component({
  selector: 'bifi-app-products-list',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  providers: [provideResourceManager(CrudProducts)],
  imports: [
    RouterLink,
    ProductStatusCardComponent,
    ButtonModule,
    SearchBar,
    TableLayout,
    Badge,
    ProductStatusSelect,
    ProductFormDialog,
  ],
  templateUrl: './products-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsList {
  private resourceManager = inject<ResourceManager<product>>(ResourceManager);

  productColumns = productColumns;
  productFilters = productFilters;

  products = this.resourceManager.data;
}
