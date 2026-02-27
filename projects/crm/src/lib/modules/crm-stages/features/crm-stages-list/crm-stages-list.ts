import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudCrmStages } from '../../services/crud-crm-stages';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { crmStage } from '../../interfaces/crm-stage';
import { crmStageColumns } from '../../libraries/crm-stage-columns';
import { crmStageFilters } from '../../libraries/crm-stage-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-crm-stages-list',
  providers: [provideResourceManager(CrudCrmStages)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './crm-stages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrmStagesList {
  private resourceManager = inject<ResourceManager<crmStage>>(ResourceManager);
  private crudCrmStages = inject(CrudCrmStages);
  private destroy$ = inject(DestroyRef);

  crmStageColumns = crmStageColumns;
  crmStageFilters = crmStageFilters;

  crmStages = this.resourceManager.data;

  deleteCrmStage(id: string) {
    this.crudCrmStages
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.crmStages.reload();
        },
      });
  }
}
