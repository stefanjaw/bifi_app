import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudHelpdeskStages } from '../../services/crud-helpdesk-stages';
import { helpdeskStage } from '../../interfaces/helpdesk-stage';
import { helpdeskStageColumns } from '../../libraries/helpdesk-stage-columns';
import { helpdeskStageFilters } from '../../libraries/helpdesk-stage-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-helpdesk-stages-list',
  providers: [provideResourceManager(CrudHelpdeskStages)],
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './helpdesk-stages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpdeskStagesList {
  private resourceManager = inject<ResourceManager<helpdeskStage>>(ResourceManager);
  private crudHelpdeskStages = inject(CrudHelpdeskStages);
  private destroy$ = inject(DestroyRef);

  columns = helpdeskStageColumns;
  filters = helpdeskStageFilters;
  stages = this.resourceManager.data;

  deleteStage(id: string) {
    this.crudHelpdeskStages
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.stages.reload();
        },
      });
  }
}
