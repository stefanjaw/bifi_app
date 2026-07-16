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
import { CrudFluidTracks } from '../../services/crud-fluid-tracks';
import { fluidTrackColumns } from '../../routes/fluid-tracks-columns';
import { fluidTrackFilters } from '../../routes/fluid-tracks-filters';
import { fluidTrack } from '../../interfaces/fluid-tracks';

@Component({
  selector: 'bifi-app-fluid-tracks-list',
  providers: [provideResourceManager(CrudFluidTracks)],
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
  templateUrl: './fluid-tracks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for fluid tracks */
export class FluidTracksList {
  private resourceManager = inject<ResourceManager<fluidTrack>>(ResourceManager);
  private crud = inject(CrudFluidTracks);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = fluidTrackColumns;
  filters = fluidTrackFilters;
  data = this.resourceManager.data;

  /** Deletes a fluid track after confirmation */
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

  /** Navigates to the fluid track edit form */
  gotoEdit = (element: fluidTrack) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
