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
import { CrudMaritalStatuses } from '../../services/crud-marital-statuses';
import { maritalStatusColumns } from '../../routes/settings-columns';
import { maritalStatusFilters } from '../../routes/settings-filters';
import { maritalStatus } from '../../interfaces/settings';

/** List component for marital statuses */
@Component({
  selector: 'bifi-app-marital-statuses-list',
  providers: [provideResourceManager(CrudMaritalStatuses)],
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
  templateUrl: './marital-statuses-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaritalStatusesList {
  private resourceManager = inject<ResourceManager<maritalStatus>>(ResourceManager);
  private crud = inject(CrudMaritalStatuses);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = maritalStatusColumns;
  filters = maritalStatusFilters;
  data = this.resourceManager.data;

  /** Deletes a marital status record after confirmation */
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

  /** Navigates to the edit form for the given marital status */
  gotoEdit = (element: maritalStatus) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
