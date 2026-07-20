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
import { CrudNotes } from '../../services/crud-notes';
import { noteColumns } from '../../routes/progress-notes-columns';
import { noteFilters } from '../../routes/progress-notes-filters';
import { note } from '../../interfaces/progress-notes';
import { NoteFormDialog } from '../note-form-dialog/note-form-dialog';

/** List component for notes */
@Component({
  selector: 'bifi-app-notes-list',
  providers: [provideResourceManager(CrudNotes)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    NoteFormDialog,
  ],
  templateUrl: './notes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesList {
  private resourceManager = inject<ResourceManager<note>>(ResourceManager);
  private crud = inject(CrudNotes);
  private destroy$ = inject(DestroyRef);

  columns = noteColumns;
  filters = noteFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(NoteFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: note): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a note after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
