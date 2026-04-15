import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudJournals } from '../../services/crud-journals';
import { journal } from '../../interfaces/journal';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { journalColumns } from '../../libraries/journal-columns';
import { journalFilters } from '../../libraries/journal-filters';

@Component({
  selector: 'bifi-app-journals-list',
  providers: [provideResourceManager(CrudJournals)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, ButtonModule, HasPermission, RouterLink, ButtonsActions],
  templateUrl: './journals-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalsList {
  private resourceManager = inject<ResourceManager<journal>>(ResourceManager);
  private crudJournals = inject(CrudJournals);
  private destroy$ = inject(DestroyRef);

  // Router
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = journalColumns;
  filters = journalFilters;
  journals = this.resourceManager.data;

  goToEditJournal = (element: journal) => {
    this.router.navigate(['../journals/edit', element._id], { relativeTo: this.route });
  };
  delete(id: string) {
    this.crudJournals
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.journals.reload();
        },
      });
  }
}
