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
import { CrudNotes } from '../../services/crud-notes';
import { noteColumns } from '../../routes/progress-notes-columns';
import { noteFilters } from '../../routes/progress-notes-filters';
import { note } from '../../interfaces/progress-notes';

@Component({
  selector: 'bifi-app-notes-list',
  providers: [provideResourceManager(CrudNotes)],
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
  templateUrl: './notes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for notes */
export class NotesList {
  private resourceManager = inject<ResourceManager<note>>(ResourceManager);
  private crud = inject(CrudNotes);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = noteColumns;
  filters = noteFilters;
  data = this.resourceManager.data;

  /** Deletes a note after confirmation */
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

  /** Navigates to the note edit form */
  gotoEdit = (element: note) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
