import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudAssetCondition } from '../../services/crud-asset-conditions';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { assetCondition } from '../../interfaces/asset-condition';
import { assetConditionColumns } from '../../libraries/asset-condition-columns';
import { assetConditionFilters } from '../../libraries/asset-condition-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

/**
 * List of Asset Conditions with create navigation, search, row navigation to
 * edit, and delete actions. Ownership of deletion etc. is handled server-side.
 */
@Component({
  selector: 'bifi-app-asset-conditions-list',
  providers: [provideResourceManager(CrudAssetCondition)],
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './asset-conditions-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetConditionsList {
  private resourceManager = inject<ResourceManager<assetCondition>>(ResourceManager);
  private crudAssetCondition = inject(CrudAssetCondition);
  private destroy$ = inject(DestroyRef);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  assetConditionColumns = assetConditionColumns;
  assetConditionFilters = assetConditionFilters;

  assetConditions = this.resourceManager.data;

  /**
   * Navigates to the edit form for the given condition.
   * @param element - The condition row to edit.
   */
  gotoEditAssetCondition = (element: assetCondition) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  /**
   * Deletes the given condition and reloads the list on success.
   * @param id - The condition id to delete.
   */
  deleteAssetCondition(id: string) {
    this.crudAssetCondition
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.assetConditions.reload();
        },
      });
  }
}
