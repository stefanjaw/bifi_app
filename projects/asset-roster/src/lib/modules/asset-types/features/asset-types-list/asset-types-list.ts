import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudAssetType } from '../../services/crud-asset-types';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { assetType } from '../../interfaces/asset-type';
import { assetTypeColumns } from '../../libraries/asset-type-columns';
import { assetTypeFilters } from '../../libraries/asset-type-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'bifi-app-asset-types-list',
  providers: [provideResourceManager(CrudAssetType)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission, ButtonsActions],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './asset-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetTypesList {
  private resourceManager = inject<ResourceManager<assetType>>(ResourceManager);
  private crudAssetType = inject(CrudAssetType);
  private destroy$ = inject(DestroyRef);

    // Router
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  assetTypeColumns = assetTypeColumns;
  assetTypeFilters = assetTypeFilters;

  assetTypes = this.resourceManager.data;

  gotoEditAssetType = (element: assetType) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  }

  deleteAssetType(id: string) {
    this.crudAssetType
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.assetTypes.reload();
        },
      });
  }
}
