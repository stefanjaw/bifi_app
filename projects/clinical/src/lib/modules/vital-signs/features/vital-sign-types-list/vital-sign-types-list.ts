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
import { CrudVitalSignTypes } from '../../services/crud-vital-sign-types';
import { vitalSignTypeColumns } from '../../routes/vital-signs-columns';
import { vitalSignTypeFilters } from '../../routes/vital-signs-filters';
import { vitalSignType } from '../../interfaces/vital-signs';

@Component({
  selector: 'bifi-app-vital-sign-types-list',
  providers: [provideResourceManager(CrudVitalSignTypes)],
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
  templateUrl: './vital-sign-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for vital sign types */
export class VitalSignTypesList {
  private resourceManager = inject<ResourceManager<vitalSignType>>(ResourceManager);
  private crud = inject(CrudVitalSignTypes);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = vitalSignTypeColumns;
  filters = vitalSignTypeFilters;
  data = this.resourceManager.data;

  /** Deletes a vital sign type after confirmation */
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

  /** Navigates to the vital sign type edit form */
  gotoEdit = (element: vitalSignType) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
