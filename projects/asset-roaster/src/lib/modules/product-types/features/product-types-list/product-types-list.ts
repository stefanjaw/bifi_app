import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudProductType } from '../../services/crud-product-types';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { productType } from '../../interfaces/product-type';
import { productTypeColumns } from '../../libraries/product-type-columns';
import { productTypeFilters } from '../../libraries/product-type-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'bifi-app-product-types-list',
  providers: [provideResourceManager(CrudProductType)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './product-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTypesList {
  private resourceManager = inject<ResourceManager<productType>>(ResourceManager);
  private crudProductType = inject(CrudProductType);
  private destroy$ = inject(DestroyRef);

  productTypeColumns = productTypeColumns;
  productTypeFilters = productTypeFilters;

  productTypes = this.resourceManager.data;

  deleteProductType(id: string) {
    this.crudProductType
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.productTypes.reload();
        },
      });
  }
}
