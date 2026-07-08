import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudProjectStages } from '../../services/crud-project-stages';
import { projectStage } from '../../interfaces/project-stage';
import { projectStageColumns } from '../../libraries/project-stage-columns';
import { projectStageFilters } from '../../libraries/project-stage-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-project-stages-list',
  providers: [provideResourceManager(CrudProjectStages)],
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './project-stages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStagesList {
  private resourceManager = inject<ResourceManager<projectStage>>(ResourceManager);
  private crudProjectStages = inject(CrudProjectStages);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = projectStageColumns;
  filters = projectStageFilters;
  stages = this.resourceManager.data;

  deleteStage(id: string) {
    this.crudProjectStages
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.stages.reload();
        },
      });
  }

  gotoEditProjectStage = (element: projectStage) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
