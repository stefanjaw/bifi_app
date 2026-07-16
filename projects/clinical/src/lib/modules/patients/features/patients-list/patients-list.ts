import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  TableLayout,
  SearchBar,
  ButtonsActions,
  ResourceManager,
  provideResourceManager,
  tableColumn,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudPatients } from '../../services/crud-patients';
import { patient } from '../../interfaces/patient';

const patientsColumns: tableColumn<patient>[] = [
  { field: 'contactId.name', title: 'name', type: 'text' },
  { field: 'contactId.lastName', title: 'lastName', type: 'text' },
  { field: 'dob', title: 'dob', type: 'date' },
];

@Component({
  selector: 'bifi-app-patients-list',
  providers: [provideResourceManager(CrudPatients)],
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
  templateUrl: './patients-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for patients */
export class PatientsList {
  private resourceManager = inject<ResourceManager<patient>>(ResourceManager);
  private crud = inject(CrudPatients);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = patientsColumns;
  data = this.resourceManager.data;

  /** Deletes a patient record after confirmation */
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

  /** Navigates to the patient edit form */
  gotoEdit = (element: patient) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
