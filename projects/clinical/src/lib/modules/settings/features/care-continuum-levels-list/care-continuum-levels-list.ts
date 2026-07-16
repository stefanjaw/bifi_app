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
import { CrudCareContinuumLevels } from '../../services/crud-care-continuum-levels';
import { careContinuumLevelColumns } from '../../routes/settings-columns';
import { careContinuumLevelFilters } from '../../routes/settings-filters';
import { careContinuumLevel } from '../../interfaces/settings';

/** List component for care continuum levels */
@Component({
  selector: 'bifi-app-care-continuum-levels-list',
  providers: [provideResourceManager(CrudCareContinuumLevels)],
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
  templateUrl: './care-continuum-levels-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareContinuumLevelsList {
  private resourceManager = inject<ResourceManager<careContinuumLevel>>(ResourceManager);
  private crud = inject(CrudCareContinuumLevels);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = careContinuumLevelColumns;
  filters = careContinuumLevelFilters;
  data = this.resourceManager.data;

  /** Deletes a care continuum level record after confirmation */
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

  /** Navigates to the edit form for the given care continuum level */
  gotoEdit = (element: careContinuumLevel) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
