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
import { CrudProgressNoteTags } from '../../services/crud-progress-note-tags';
import { progressNoteTagColumns } from '../../routes/progress-notes-columns';
import { progressNoteTagFilters } from '../../routes/progress-notes-filters';
import { patientProgressNoteTag } from '../../interfaces/progress-notes';

@Component({
  selector: 'bifi-app-progress-note-tags-list',
  providers: [provideResourceManager(CrudProgressNoteTags)],
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
  templateUrl: './progress-note-tags-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for progress note tags */
export class ProgressNoteTagsList {
  private resourceManager = inject<ResourceManager<patientProgressNoteTag>>(ResourceManager);
  private crud = inject(CrudProgressNoteTags);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = progressNoteTagColumns;
  filters = progressNoteTagFilters;
  data = this.resourceManager.data;

  /** Deletes a progress note tag after confirmation */
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

  /** Navigates to the progress note tag edit form */
  gotoEdit = (element: patientProgressNoteTag) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
