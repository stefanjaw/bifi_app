import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudCrm } from '../../services/crud-crm';
import { crmColumns } from '../../libraries/crm-columns';
import { crmFilters } from '../../libraries/crm-filters';
import { crm } from '../../interfaces/crm';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-crm-list',
  providers: [provideResourceManager(CrudCrm)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './crm-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrmList {
  private resourceManager = inject<ResourceManager<crm>>(ResourceManager);
  private crudCrm = inject(CrudCrm);
  private destroy$ = inject(DestroyRef);

  crmColumns = crmColumns;
  crmFilters = crmFilters;

  entries = this.resourceManager.data;

  deleteEntry(id: string) {
    this.crudCrm
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.entries.reload();
        },
      });
  }
}
