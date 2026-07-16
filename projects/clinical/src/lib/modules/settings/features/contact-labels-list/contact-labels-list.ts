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
import { CrudContactLabels } from '../../services/crud-contact-labels';
import { contactLabelColumns } from '../../routes/settings-columns';
import { contactLabelFilters } from '../../routes/settings-filters';
import { contactLabel } from '../../interfaces/settings';

/** List component for contact labels */
@Component({
  selector: 'bifi-app-contact-labels-list',
  providers: [provideResourceManager(CrudContactLabels)],
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
  templateUrl: './contact-labels-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLabelsList {
  private resourceManager = inject<ResourceManager<contactLabel>>(ResourceManager);
  private crud = inject(CrudContactLabels);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = contactLabelColumns;
  filters = contactLabelFilters;
  data = this.resourceManager.data;

  /** Deletes a contact label record after confirmation */
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

  /** Navigates to the edit form for the given contact label */
  gotoEdit = (element: contactLabel) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
