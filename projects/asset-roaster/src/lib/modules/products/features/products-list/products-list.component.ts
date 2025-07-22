import { productFilters } from '../../libraries/product-filters';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductStatusCardComponent } from '@avalantec/asset-roaster/modules/products/ui/product-status-card/product-status-card.component';
import {
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

@Component({
  selector: 'bifi-app-products-list',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  providers: [provideResourceManager(CrudProductsService)],
  imports: [ProductStatusCardComponent, ButtonModule, TableLayout, MatIcon, MatMenuItem, SearchBar],
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  private resourceManager = inject<ResourceManager<product>>(ResourceManager);

  productColumns = productColumns;
  productFilters = productFilters;

  products = this.resourceManager.data;
}
