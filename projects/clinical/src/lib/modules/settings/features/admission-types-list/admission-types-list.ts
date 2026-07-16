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
import { CrudAdmissionTypes } from '../../services/crud-admission-types';
import { admissionTypeColumns } from '../../routes/settings-columns';
import { admissionTypeFilters } from '../../routes/settings-filters';
import { admissionType } from '../../interfaces/settings';

/** List component for admission types */
@Component({
  selector: 'bifi-app-admission-types-list',
  providers: [provideResourceManager(CrudAdmissionTypes)],
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
  templateUrl: './admission-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionTypesList {
  private resourceManager = inject<ResourceManager<admissionType>>(ResourceManager);
  private crud = inject(CrudAdmissionTypes);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = admissionTypeColumns;
  filters = admissionTypeFilters;
  data = this.resourceManager.data;

  /** Deletes an admission type record after confirmation */
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

  /** Navigates to the edit form for the given admission type */
  gotoEdit = (element: admissionType) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
