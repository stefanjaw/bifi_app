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
import { CrudRaces } from '../../services/crud-races';
import { raceColumns } from '../../routes/settings-columns';
import { raceFilters } from '../../routes/settings-filters';
import { race } from '../../interfaces/settings';
import { RaceFormDialog } from '../race-form-dialog/race-form-dialog';

/** List component for races */
@Component({
  selector: 'bifi-app-races-list',
  providers: [provideResourceManager(CrudRaces)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    RaceFormDialog,
  ],
  templateUrl: './races-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RacesList {
  private resourceManager = inject<ResourceManager<race>>(ResourceManager);
  private crud = inject(CrudRaces);
  private destroy$ = inject(DestroyRef);

  columns = raceColumns;
  filters = raceFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(RaceFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: race): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a race record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
