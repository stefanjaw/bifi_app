import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudPurchaseStages } from '../../services/crud-purchase-stages';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { purchaseStage } from '../../interfaces/purchase-stage';
import { purchaseStageColumns } from '../../libraries/purchase-stage-columns';
import { purchaseStageFilters } from '../../libraries/purchase-stage-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-purchase-stages-list',
  providers: [provideResourceManager(CrudPurchaseStages)],
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
  templateUrl: './purchase-stages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseStagesList {
  private resourceManager = inject<ResourceManager<purchaseStage>>(ResourceManager);
  private crudPurchaseStages = inject(CrudPurchaseStages);
  private destroy$ = inject(DestroyRef);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  purchaseStageColumns = purchaseStageColumns;
  purchaseStageFilters = purchaseStageFilters;

  purchaseStages = this.resourceManager.data;

  goToEditStage = (element: purchaseStage) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
  deleteStage(id: string) {
    this.crudPurchaseStages
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.purchaseStages.reload();
        },
      });
  }
}
