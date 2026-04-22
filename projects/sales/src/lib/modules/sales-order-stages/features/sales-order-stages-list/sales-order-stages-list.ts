import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudSalesOrderStages } from '../../services/crud-sales-order-stages';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { salesOrderStage } from '../../interfaces/sales-order-stage';
import { salesOrderStageColumns } from '../../libraries/sales-order-stage-columns';
import { salesOrderStageFilters } from '../../libraries/sales-order-stage-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-sales-order-stages-list',
  providers: [provideResourceManager(CrudSalesOrderStages)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission, ButtonsActions],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './sales-order-stages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesOrderStagesList {
  private resourceManager = inject<ResourceManager<salesOrderStage>>(ResourceManager);
  private crudSalesOrderStages = inject(CrudSalesOrderStages);
  private destroy$ = inject(DestroyRef);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  salesOrderStageColumns = salesOrderStageColumns;
  salesOrderStageFilters = salesOrderStageFilters;

  stages = this.resourceManager.data;

  goToEditStage = (element: salesOrderStage) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  deleteStage(id: string) {
    this.crudSalesOrderStages
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.stages.reload();
        },
      });
  }
}
