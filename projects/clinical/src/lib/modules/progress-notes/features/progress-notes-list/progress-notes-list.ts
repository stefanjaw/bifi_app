import { Component, ChangeDetectionStrategy, inject, DestroyRef, viewChild } from '@angular/core';
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
import { ProgressNoteFormDialog } from '../progress-note-form-dialog/progress-note-form-dialog';

/** List component for progress notes */
@Component({
  selector: 'bifi-app-progress-notes-list',
  providers: [provideResourceManager(CrudProgressNotes)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    ProgressNoteFormDialog,
  ],
  templateUrl: './progress-notes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressNotesList {
  private resourceManager = inject<ResourceManager<progressNote>>(ResourceManager);
  private crud = inject(CrudProgressNotes);
  private destroy$ = inject(DestroyRef);

  columns = progressNoteColumns;
  filters = progressNoteFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(ProgressNoteFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: progressNote): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a progress note after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
