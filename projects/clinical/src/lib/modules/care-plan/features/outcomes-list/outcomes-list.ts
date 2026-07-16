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
import { CrudOutcomes } from '../../services/crud-outcomes';
import { outcomeColumns } from '../../routes/care-plan-columns';
import { outcomeFilters } from '../../routes/care-plan-filters';
import { outcome } from '../../interfaces/care-plan';

@Component({
  selector: 'bifi-app-outcomes-list',
  providers: [provideResourceManager(CrudOutcomes)],
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
  templateUrl: './outcomes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for outcomes */
export class OutcomesList {
  private resourceManager = inject<ResourceManager<outcome>>(ResourceManager);
  private crud = inject(CrudOutcomes);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = outcomeColumns;
  filters = outcomeFilters;
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
  gotoEdit = (element: outcome) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
