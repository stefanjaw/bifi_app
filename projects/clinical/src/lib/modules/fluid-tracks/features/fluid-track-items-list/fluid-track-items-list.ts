import { Component, ChangeDetectionStrategy, inject, DestroyRef, viewChild } from '@angular/core';
import {
  TableLayout,
  SearchBar,
  ButtonsActions,
  ResourceManager,
  provideResourceManager,
  tableColumn,
  filter,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudFluidTrackItems } from '../../services/crud-fluid-track-items';
import { fluidTrackItem } from '../../interfaces/fluid-tracks';
import { FluidTrackItemFormDialog } from '../fluid-track-item-form-dialog/fluid-track-item-form-dialog';

const fluidTrackItemColumns: tableColumn<fluidTrackItem>[] = [
  { field: '_id', title: '_id', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

const fluidTrackItemFilters: filter<fluidTrackItem>[] = [{ field: '_id', type: 'string' }];

/** List component for fluid track items */
@Component({
  selector: 'bifi-app-fluid-track-items-list',
  providers: [provideResourceManager(CrudFluidTrackItems)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    FluidTrackItemFormDialog,
  ],
  templateUrl: './fluid-track-items-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FluidTrackItemsList {
  private resourceManager = inject<ResourceManager<fluidTrackItem>>(ResourceManager);
  private crud = inject(CrudFluidTrackItems);
  private destroy$ = inject(DestroyRef);

  columns = fluidTrackItemColumns;
  filters = fluidTrackItemFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(FluidTrackItemFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: fluidTrackItem): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a fluid track item after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
