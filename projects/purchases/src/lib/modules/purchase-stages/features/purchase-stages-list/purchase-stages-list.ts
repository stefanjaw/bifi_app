import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudPurchaseStages } from '../../services/crud-purchase-stages';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { purchaseStage } from '../../interfaces/purchase-stage';
import { purchaseStageColumns } from '../../libraries/purchase-stage-columns';
import { purchaseStageFilters } from '../../libraries/purchase-stage-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-purchase-stages-list',
  providers: [provideResourceManager(CrudPurchaseStages)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink],
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

  purchaseStageColumns = purchaseStageColumns;
  purchaseStageFilters = purchaseStageFilters;

  purchaseStages = this.resourceManager.data;

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
