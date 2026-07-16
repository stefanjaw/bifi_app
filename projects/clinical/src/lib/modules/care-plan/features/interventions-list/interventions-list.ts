import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  TableLayout,
  SearchBar,
  ButtonsActions,
  ResourceManager,
  provideResourceManager,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudInterventions } from '../../services/crud-interventions';
import { interventionColumns } from '../../routes/care-plan-columns';
import { interventionFilters } from '../../routes/care-plan-filters';
import { intervention } from '../../interfaces/care-plan';

@Component({
  selector: 'bifi-app-interventions-list',
  providers: [provideResourceManager(CrudInterventions)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  templateUrl: './interventions-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for interventions */
export class InterventionsList {
  private resourceManager = inject<ResourceManager<intervention>>(ResourceManager);
  private crud = inject(CrudInterventions);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = interventionColumns;
  filters = interventionFilters;
  data = this.resourceManager.data;

  /** Deletes a record after confirmation */
  delete(id: string) {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.resourceManager.data.reload();
        },
      });
  }

  /** Navigates to the edit form */
  gotoEdit = (element: intervention) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
