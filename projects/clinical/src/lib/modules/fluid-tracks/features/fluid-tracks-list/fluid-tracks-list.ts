import { Component, ChangeDetectionStrategy, inject, DestroyRef, viewChild } from '@angular/core';
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
import { FluidTrackFormDialog } from '../fluid-track-form-dialog/fluid-track-form-dialog';

/** List component for fluid tracks */
@Component({
  selector: 'bifi-app-fluid-tracks-list',
  providers: [provideResourceManager(CrudFluidTracks)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    FluidTrackFormDialog,
  ],
  templateUrl: './fluid-tracks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FluidTracksList {
  private resourceManager = inject<ResourceManager<fluidTrack>>(ResourceManager);
  private crud = inject(CrudFluidTracks);
  private destroy$ = inject(DestroyRef);

  columns = fluidTrackColumns;
  filters = fluidTrackFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(FluidTrackFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: fluidTrack): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a fluid track after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
