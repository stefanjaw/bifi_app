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
import { CrudMedicalAllergies } from '../../services/crud-medical-allergies';
import { medicalAllergyColumns } from '../../routes/settings-columns';
import { medicalAllergyFilters } from '../../routes/settings-filters';
import { medicalAllergy } from '../../interfaces/settings';

/** List component for medical allergies */
@Component({
  selector: 'bifi-app-medical-allergies-list',
  providers: [provideResourceManager(CrudMedicalAllergies)],
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
  templateUrl: './medical-allergies-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalAllergiesList {
  private resourceManager = inject<ResourceManager<medicalAllergy>>(ResourceManager);
  private crud = inject(CrudMedicalAllergies);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = medicalAllergyColumns;
  filters = medicalAllergyFilters;
  data = this.resourceManager.data;

  /** Deletes a medical allergy record after confirmation */
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

  /** Navigates to the edit form for the given medical allergy */
  gotoEdit = (element: medicalAllergy) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
