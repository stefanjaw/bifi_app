import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudSalesTargets } from '../../../services/crud-sales-targets';
import { salesTarget } from '../../../interfaces/sales-target';
import { salesTargetColumns } from '../../../libraries/sales-target-columns';
import { ButtonModule } from 'primeng/button';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HasPermission } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-targets-list',
  providers: [provideResourceManager(CrudSalesTargets)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, ButtonModule, RouterLink, HasPermission, ButtonsActions],
  templateUrl: './targets-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetsList {
  private resourceManager = inject<ResourceManager<salesTarget>>(ResourceManager);
  private crudSalesTargets = inject(CrudSalesTargets);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  salesTargetColumns = salesTargetColumns;

  entries = this.resourceManager.data;

  deleteEntry(id: string) {
    this.crudSalesTargets
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.entries.reload();
        },
      });
  }

  gotoEditTarget = (element: salesTarget) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
