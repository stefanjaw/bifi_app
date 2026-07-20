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
import { CrudAdmissionTypes } from '../../services/crud-admission-types';
import { admissionTypeColumns } from '../../routes/settings-columns';
import { admissionTypeFilters } from '../../routes/settings-filters';
import { admissionType } from '../../interfaces/settings';
import { AdmissionTypeFormDialog } from '../admission-type-form-dialog/admission-type-form-dialog';

/** List component for admission types */
@Component({
  selector: 'bifi-app-admission-types-list',
  providers: [provideResourceManager(CrudAdmissionTypes)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    AdmissionTypeFormDialog,
  ],
  templateUrl: './admission-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionTypesList {
  private resourceManager = inject<ResourceManager<admissionType>>(ResourceManager);
  private crud = inject(CrudAdmissionTypes);
  private destroy$ = inject(DestroyRef);

  columns = admissionTypeColumns;
  filters = admissionTypeFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(AdmissionTypeFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: admissionType): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes an admission type record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
