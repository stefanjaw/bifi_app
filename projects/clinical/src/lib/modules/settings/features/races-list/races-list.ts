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
import { CrudRaces } from '../../services/crud-races';
import { raceColumns } from '../../routes/settings-columns';
import { raceFilters } from '../../routes/settings-filters';
import { race } from '../../interfaces/settings';

/** List component for races */
@Component({
  selector: 'bifi-app-races-list',
  providers: [provideResourceManager(CrudRaces)],
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
  templateUrl: './races-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RacesList {
  private resourceManager = inject<ResourceManager<race>>(ResourceManager);
  private crud = inject(CrudRaces);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = raceColumns;
  filters = raceFilters;
  data = this.resourceManager.data;

  /** Deletes a race record after confirmation */
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

  /** Navigates to the edit form for the given race */
  gotoEdit = (element: race) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
