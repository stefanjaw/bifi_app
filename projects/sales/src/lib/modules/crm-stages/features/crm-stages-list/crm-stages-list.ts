import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudCrmStages } from '../../services/crud-crm-stages';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { crmStage } from '../../interfaces/crm-stage';
import { crmStageColumns } from '../../libraries/crm-stage-columns';
import { crmStageFilters } from '../../libraries/crm-stage-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-crm-stages-list',
  providers: [provideResourceManager(CrudCrmStages)],
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
  templateUrl: './crm-stages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrmStagesList {
  private resourceManager = inject<ResourceManager<crmStage>>(ResourceManager);
  private crudCrmStages = inject(CrudCrmStages);
  private destroy$ = inject(DestroyRef);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  crmStageColumns = crmStageColumns;
  crmStageFilters = crmStageFilters;

  crmStages = this.resourceManager.data;

  goToEditCrmStage = (element: crmStage) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
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
