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
import { CrudMedicalPrecautions } from '../../services/crud-medical-precautions';
import { medicalPrecautionColumns } from '../../routes/settings-columns';
import { medicalPrecautionFilters } from '../../routes/settings-filters';
import { medicalPrecaution } from '../../interfaces/settings';

/** List component for medical precautions */
@Component({
  selector: 'bifi-app-medical-precautions-list',
  providers: [provideResourceManager(CrudMedicalPrecautions)],
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
  templateUrl: './medical-precautions-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPrecautionsList {
  private resourceManager = inject<ResourceManager<medicalPrecaution>>(ResourceManager);
  private crud = inject(CrudMedicalPrecautions);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = medicalPrecautionColumns;
  filters = medicalPrecautionFilters;
  data = this.resourceManager.data;

  /** Deletes a medical precaution record after confirmation */
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

  /** Navigates to the edit form for the given medical precaution */
  gotoEdit = (element: medicalPrecaution) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
