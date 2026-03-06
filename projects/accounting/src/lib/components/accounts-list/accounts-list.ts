import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudAccounts } from '../../services/crud-accounts';
import { account } from '../../interfaces/account';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
  tableColumn,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

const accountColumns: tableColumn<account>[] = [
  { field: 'code', title: 'Code', type: 'text', sortable: true },
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'type', title: 'Type', type: 'text' },
  { field: 'active', title: 'Active', type: 'text' },
];

@Component({
  selector: 'bifi-app-accounts-list',
  providers: [provideResourceManager(CrudAccounts)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './accounts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsList {
  private resourceManager = inject<ResourceManager<account>>(ResourceManager);
  private crudAccounts = inject(CrudAccounts);
  private destroy$ = inject(DestroyRef);

  columns = accountColumns;
  accounts = this.resourceManager.data;

  delete(id: string) {
    this.crudAccounts
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.accounts.reload(); } });
  }
}
