import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudMailingLists } from '../../services/crud-mailing-lists';
import { mailingList } from '../../interfaces/mailing-list';
import { mailingListColumns } from '../../libraries/mailing-list-columns';
import { mailingListFilters } from '../../libraries/mailing-list-filters';

@Component({
  selector: 'bifi-app-mailing-lists-list',
  providers: [provideResourceManager(CrudMailingLists)],
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './mailing-lists-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailingListsList {
  private resourceManager = inject<ResourceManager<mailingList>>(ResourceManager);
  private crudLists = inject(CrudMailingLists);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = mailingListColumns;
  filters = mailingListFilters;

  lists = this.resourceManager.data;

  goToEdit = (element: mailingList) => {
    this.router.navigate(['edit', element._id], { relativeTo: this.route });
  };

  deleteList(id: string) {
    this.crudLists
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.lists.reload();
        },
      });
  }
}
