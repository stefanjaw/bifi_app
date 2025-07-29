import { productFilters } from '../../libraries/product-filters';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
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
import { CreateProductForm } from '../../services/create-product-form';
import { Subject, takeUntil } from 'rxjs';

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
export class ProductsList implements OnDestroy {
  private resourceManager = inject<ResourceManager<product>>(ResourceManager);
  private createProductForm = inject(CreateProductForm);
  private destroy$ = new Subject<void>();

  productColumns = productColumns;
  productFilters = productFilters;

  products = this.resourceManager.data;

  /**
   * Subscribe to the submitted form event from the create product form.
   * If the form was submitted successfully, reload the list of products.
   */
  constructor() {
    this.createProductForm.submitted.pipe(takeUntil(this.destroy$)).subscribe(saved => {
      if (saved) this.products.reload();
    });
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * It completes and unsubscribes from the destroy$ subject to prevent
   * memory leaks by ensuring that all subscriptions are cleaned up.
   */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
