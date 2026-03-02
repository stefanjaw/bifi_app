import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudSalesTargets } from '../../../services/crud-sales-targets';
import { salesTarget } from '../../../interfaces/sales-target';
import { salesTargetColumns } from '../../../libraries/sales-target-columns';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-targets-list',
  providers: [provideResourceManager(CrudSalesTargets)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, ButtonModule, RouterLink],
  templateUrl: './targets-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetsList {
  private resourceManager = inject<ResourceManager<salesTarget>>(ResourceManager);
  private crudSalesTargets = inject(CrudSalesTargets);
  private destroy$ = inject(DestroyRef);

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
}
