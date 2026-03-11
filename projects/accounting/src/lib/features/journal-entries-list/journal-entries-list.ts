import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudJournalEntries } from '../../services/crud-journal-entries';
import { journalEntry } from '../../interfaces/journal-entry';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { journalEntryColumns } from '../../libraries/journal-entry-columns';
import { journalEntryFilters } from '../../libraries/journal-entry-filters';

@Component({
  selector: 'bifi-app-journal-entries-list',
  providers: [provideResourceManager(CrudJournalEntries)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './journal-entries-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalEntriesList {
  private resourceManager = inject<ResourceManager<journalEntry>>(ResourceManager);
  private crudJournalEntries = inject(CrudJournalEntries);
  private destroy$ = inject(DestroyRef);

  columns = journalEntryColumns;
  filters = journalEntryFilters;
  entries = this.resourceManager.data;

  delete(id: string) {
    this.crudJournalEntries
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.entries.reload(); } });
  }
}
