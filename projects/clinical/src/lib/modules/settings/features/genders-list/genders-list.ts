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
import { CrudGenders } from '../../services/crud-genders';
import { genderColumns } from '../../routes/settings-columns';
import { genderFilters } from '../../routes/settings-filters';
import { gender } from '../../interfaces/settings';
import { GenderFormDialog } from '../gender-form-dialog/gender-form-dialog';

/** List component for genders */
@Component({
  selector: 'bifi-app-genders-list',
  providers: [provideResourceManager(CrudGenders)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    GenderFormDialog,
  ],
  templateUrl: './genders-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GendersList {
  private resourceManager = inject<ResourceManager<gender>>(ResourceManager);
  private crud = inject(CrudGenders);
  private destroy$ = inject(DestroyRef);

  columns = genderColumns;
  filters = genderFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(GenderFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: gender): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a gender record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
