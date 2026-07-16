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
import { CrudGenders } from '../../services/crud-genders';
import { genderColumns } from '../../routes/settings-columns';
import { genderFilters } from '../../routes/settings-filters';
import { gender } from '../../interfaces/settings';

/** List component for genders */
@Component({
  selector: 'bifi-app-genders-list',
  providers: [provideResourceManager(CrudGenders)],
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
  templateUrl: './genders-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GendersList {
  private resourceManager = inject<ResourceManager<gender>>(ResourceManager);
  private crud = inject(CrudGenders);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = genderColumns;
  filters = genderFilters;
  data = this.resourceManager.data;

  /** Deletes a gender record after confirmation */
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

  /** Navigates to the edit form for the given gender */
  gotoEdit = (element: gender) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
