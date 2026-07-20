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
import { CrudMedicalPrecautions } from '../../services/crud-medical-precautions';
import { medicalPrecautionColumns } from '../../routes/settings-columns';
import { medicalPrecautionFilters } from '../../routes/settings-filters';
import { medicalPrecaution } from '../../interfaces/settings';
import { MedicalPrecautionFormDialog } from '../medical-precaution-form-dialog/medical-precaution-form-dialog';

/** List component for medical precautions */
@Component({
  selector: 'bifi-app-medical-precautions-list',
  providers: [provideResourceManager(CrudMedicalPrecautions)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    MedicalPrecautionFormDialog,
  ],
  templateUrl: './medical-precautions-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPrecautionsList {
  private resourceManager = inject<ResourceManager<medicalPrecaution>>(ResourceManager);
  private crud = inject(CrudMedicalPrecautions);
  private destroy$ = inject(DestroyRef);

  columns = medicalPrecautionColumns;
  filters = medicalPrecautionFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(MedicalPrecautionFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: medicalPrecaution): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a medical precaution record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
