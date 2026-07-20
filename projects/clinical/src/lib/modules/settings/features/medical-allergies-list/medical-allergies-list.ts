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
import { CrudMedicalAllergies } from '../../services/crud-medical-allergies';
import { medicalAllergyColumns } from '../../routes/settings-columns';
import { medicalAllergyFilters } from '../../routes/settings-filters';
import { medicalAllergy } from '../../interfaces/settings';
import { MedicalAllergyFormDialog } from '../medical-allergy-form-dialog/medical-allergy-form-dialog';

/** List component for medical allergies */
@Component({
  selector: 'bifi-app-medical-allergies-list',
  providers: [provideResourceManager(CrudMedicalAllergies)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    MedicalAllergyFormDialog,
  ],
  templateUrl: './medical-allergies-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalAllergiesList {
  private resourceManager = inject<ResourceManager<medicalAllergy>>(ResourceManager);
  private crud = inject(CrudMedicalAllergies);
  private destroy$ = inject(DestroyRef);

  columns = medicalAllergyColumns;
  filters = medicalAllergyFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(MedicalAllergyFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: medicalAllergy): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a medical allergy record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
