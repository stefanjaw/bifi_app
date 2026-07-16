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
import { CrudProgressNotes } from '../../services/crud-progress-notes';
import { progressNoteColumns } from '../../routes/progress-notes-columns';
import { progressNoteFilters } from '../../routes/progress-notes-filters';
import { progressNote } from '../../interfaces/progress-notes';

@Component({
  selector: 'bifi-app-progress-notes-list',
  providers: [provideResourceManager(CrudProgressNotes)],
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
  templateUrl: './progress-notes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for progress notes */
export class ProgressNotesList {
  private resourceManager = inject<ResourceManager<progressNote>>(ResourceManager);
  private crud = inject(CrudProgressNotes);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = progressNoteColumns;
  filters = progressNoteFilters;
  data = this.resourceManager.data;

  /** Deletes a progress note after confirmation */
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

  /** Navigates to the progress note edit form */
  gotoEdit = (element: progressNote) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
