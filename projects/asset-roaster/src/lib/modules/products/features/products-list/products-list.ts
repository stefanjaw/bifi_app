import { productFilters } from '../../libraries/product-filters';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { productColumns } from '../../libraries/product-columns';
import { product } from '../../interfaces/product';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import {
  FilterManager,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { Badge } from '@avalantec/base-app/ui';
import { CrudProducts } from '../../services/crud-products';
import { ProductStatusCardComponent } from '../../ui/product-status-card/product-status-card';
import { ProductStatusSelect } from '../../ui/product-status-select/product-status-select';
import { ProductFormDialog } from '../product-form-dialog/product-form-dialog';
import { ProductMaintenanceContext } from '../../services/product-maintenance-context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductStatusFilterManager } from '../../services/product-status-filter-manager';
import { HasPermission } from '@avalantec/base-app/auth';

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
    HasPermission,
  ],
  templateUrl: './products-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsList {
  private resourceManager = inject<ResourceManager<product>>(ResourceManager);
  private destroy$ = inject(DestroyRef);
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  productColumns = productColumns;
  productFilters = productFilters;

  products = this.resourceManager.data;

  //#region Counting of products by status
  private productsService = inject(CrudProducts);
  private productStatusFilterManager = inject(ProductStatusFilterManager);
  private filterManager = inject(FilterManager);

  //#region Queries
  private productsUnderServiceQuery = signal(
    this.filterManager.getFilterObjectUtil([
      this.productStatusFilterManager.getFilterByStatus('under-service'),
    ])
  );
  private productsInPMQuery = signal(
    this.filterManager.getFilterObjectUtil([
      this.productStatusFilterManager.getFilterByStatus('in-pm'),
    ])
  );
  private productsOverdueQuery = signal(
    this.filterManager.getFilterObjectUtil([this.productStatusFilterManager.getFilterByOverdue()])
  );
  private productsDueQuery = signal(
    this.filterManager.getFilterObjectUtil([this.productStatusFilterManager.getFilterByDue()])
  );

  private productsPMNotSetQuery = signal(
    this.filterManager.getFilterObjectUtil([this.productStatusFilterManager.getFilterByPMNotSet()])
  );
  //#endregion

  //#region Counts
  protected productsUnderServiceCount = this.productsService.getCount({
    searchParams: this.productsUnderServiceQuery,
  });
  protected productsOverdueCount = this.productsService.getCount({
    searchParams: this.productsOverdueQuery,
  });
  protected productsDueCount = this.productsService.getCount({
    searchParams: this.productsDueQuery,
  });
  protected productsInPMCount = this.productsService.getCount({
    searchParams: this.productsInPMQuery,
  });
  protected productsPMNotSetCount = this.productsService.getCount({
    searchParams: this.productsPMNotSetQuery,
  });
  //#endregion
  //#endregion

  /**
   * Subscribe to the submitted form event from the create product form.
   * If the form was submitted successfully, reload the list of products.
   */
  constructor() {
    this.productMaintenanceContext.handleEvents$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(event => {
        if (event === 'saved') {
          this.products.reload();

          // reload counts
          this.productsUnderServiceCount.reload();
          this.productsOverdueCount.reload();
          this.productsDueCount.reload();
          this.productsInPMCount.reload();
          this.productsPMNotSetCount.reload();
        }
      });
  }
}
