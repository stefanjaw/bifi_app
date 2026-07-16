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
import { CrudVitalSigns } from '../../services/crud-vital-signs';
import { vitalSignColumns } from '../../routes/vital-signs-columns';
import { vitalSignFilters } from '../../routes/vital-signs-filters';
import { vitalSign } from '../../interfaces/vital-signs';

@Component({
  selector: 'bifi-app-vital-signs-list',
  providers: [provideResourceManager(CrudVitalSigns)],
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
  templateUrl: './vital-signs-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for vital signs */
export class VitalSignsList {
  private resourceManager = inject<ResourceManager<vitalSign>>(ResourceManager);
  private crud = inject(CrudVitalSigns);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = vitalSignColumns;
  filters = vitalSignFilters;
  data = this.resourceManager.data;

  /** Deletes a vital sign record after confirmation */
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

  /** Navigates to the vital sign edit form */
  gotoEdit = (element: vitalSign) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
