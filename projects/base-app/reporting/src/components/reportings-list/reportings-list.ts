import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudReporting } from '../../services/crud-reporting';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { reporting } from '@avalantec/base-app/interfaces';
import { reportingColumns } from '../../libraries/reporting-columns';
import { reportingFilters } from '../../libraries/reporting-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-reportings-list',
  providers: [provideResourceManager(CrudReporting)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './reportings-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingsList {
  private resourceManager = inject<ResourceManager<reporting>>(ResourceManager);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private crudReporting = inject(CrudReporting);
  private destroy$ = inject(DestroyRef);

  reportingColumns = reportingColumns;
  reportingFilters = reportingFilters;

  reportings = this.resourceManager.data;

  deleteReporting(id: string) {
    this.crudReporting
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.reportings.reload();
        },
      });
  }

  goToCreate() {
    this.router.navigate(['create'], { relativeTo: this.route.parent });
  }

  goToEdit(_id: string) {
    this.router.navigate(['edit', _id], { relativeTo: this.route.parent });
  }
}
