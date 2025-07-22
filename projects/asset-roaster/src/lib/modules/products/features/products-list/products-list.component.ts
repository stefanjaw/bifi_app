import { productFilters } from '../../libraries/product-filters';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductStatusCardComponent } from '@avalantec/asset-roaster/modules/products/ui/product-status-card/product-status-card.component';
import {
  filter,
  FilterManager,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app';
import { CrudProductsService } from '@avalantec/asset-roaster/modules/products/services/crud-products.service';
import { MatIcon } from '@angular/material/icon';
import { MatMenuItem } from '@angular/material/menu';
import { productColumns } from '../../libraries/product-columns';
import { product } from '../../interfaces/product';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bifi-app-products-list',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  providers: [provideResourceManager(CrudProductsService)],
  imports: [
    RouterLink,
    ProductStatusCardComponent,
    ButtonModule,
    TableLayout,
    MatIcon,
    MatMenuItem,
    SearchBar,
  ],
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  private resourceManager = inject<ResourceManager<product>>(ResourceManager);
  private filterManager = inject(FilterManager);

  productColumns = productColumns;
  productFilters = productFilters;

  products = this.resourceManager.data;

  filterByCard(filters: filter<any>[]) {
    this.filterManager.clearFilters();
    this.filterManager.addFilters(filters);
  }
}
