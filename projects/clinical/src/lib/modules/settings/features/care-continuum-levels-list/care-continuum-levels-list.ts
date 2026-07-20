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
import { CrudCareContinuumLevels } from '../../services/crud-care-continuum-levels';
import { careContinuumLevelColumns } from '../../routes/settings-columns';
import { careContinuumLevelFilters } from '../../routes/settings-filters';
import { careContinuumLevel } from '../../interfaces/settings';
import { CareLevelFormDialog } from '../care-level-form-dialog/care-level-form-dialog';

/** List component for care continuum levels */
@Component({
  selector: 'bifi-app-care-continuum-levels-list',
  providers: [provideResourceManager(CrudCareContinuumLevels)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    CareLevelFormDialog,
  ],
  templateUrl: './care-continuum-levels-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareContinuumLevelsList {
  private resourceManager = inject<ResourceManager<careContinuumLevel>>(ResourceManager);
  private crud = inject(CrudCareContinuumLevels);
  private destroy$ = inject(DestroyRef);

  columns = careContinuumLevelColumns;
  filters = careContinuumLevelFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(CareLevelFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: careContinuumLevel): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a care continuum level record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
