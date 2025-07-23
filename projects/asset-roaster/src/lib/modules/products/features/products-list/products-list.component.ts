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
import { CrudProductsService } from '../../services/crud-products.service';
import { ProductStatusCardComponent } from '../../ui/product-status-card/product-status-card.component';
import { ProductStatusSelect } from '../../ui/product-status-select/product-status-select';
import { ProductFormDialog } from '@avalantec/asset-roaster/modules/products/features/product-form-dialog/product-form-dialog';
import { FormValueState } from '@avalantec/base-app/form';
import { CreateEquipmentFormModel } from '@avalantec/asset-roaster/modules/products/services/create-equipment-form';

@Component({
  selector: 'bifi-app-products-list',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  providers: [provideResourceManager(CrudProductsService)],
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
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  private resourceManager = inject<ResourceManager<product>>(ResourceManager);

  productColumns = productColumns;
  productFilters = productFilters;

  products = this.resourceManager.data;

  // #region Create dialog
  handleCreate(data: FormValueState<CreateEquipmentFormModel>) {
    // this.closeCreateDialog();
    console.log('create call', data);
  }
  // #endregion
}
