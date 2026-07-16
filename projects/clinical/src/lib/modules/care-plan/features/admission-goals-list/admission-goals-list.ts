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
import { CrudAdmissionGoals } from '../../services/crud-admission-goals';
import { admissionGoalColumns } from '../../routes/care-plan-columns';
import { admissionGoalFilters } from '../../routes/care-plan-filters';
import { admissionGoal } from '../../interfaces/care-plan';

@Component({
  selector: 'bifi-app-admission-goals-list',
  providers: [provideResourceManager(CrudAdmissionGoals)],
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
  templateUrl: './admission-goals-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for admission goals */
export class AdmissionGoalsList {
  private resourceManager = inject<ResourceManager<admissionGoal>>(ResourceManager);
  private crud = inject(CrudAdmissionGoals);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = admissionGoalColumns;
  filters = admissionGoalFilters;
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
  gotoEdit = (element: admissionGoal) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
