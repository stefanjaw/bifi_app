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
import { CrudCareContinuum } from '../../services/crud-care-continuum';
import { careContinuumColumns } from '../../routes/care-continuum-columns';
import { careContinuumFilters } from '../../routes/care-continuum-filters';
import { careContinuum } from '../../interfaces/care-continuum';

@Component({
  selector: 'bifi-app-care-continuum-list',
  providers: [provideResourceManager(CrudCareContinuum)],
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
  templateUrl: './care-continuum-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for care continuum records */
export class CareContinuumList {
  private resourceManager = inject<ResourceManager<careContinuum>>(ResourceManager);
  private crud = inject(CrudCareContinuum);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = careContinuumColumns;
  filters = careContinuumFilters;
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
  gotoEdit = (element: careContinuum) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
