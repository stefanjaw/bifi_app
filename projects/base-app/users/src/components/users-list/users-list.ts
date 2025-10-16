import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { CrudUsers } from '../../services/crud-users';
import { userColumns } from '../../libraries/user-columns';
import { userFilters } from '../../libraries/user-filters';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { user } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-users-list',
  providers: [provideResourceManager(CrudUsers)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './users-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersList {
  private resourceManager = inject<ResourceManager<user>>(ResourceManager);
  private crudUsers = inject(CrudUsers);
  private destroy$ = inject(DestroyRef);

  userColumns = userColumns;
  userFilters = userFilters;

  users = this.resourceManager.data;

  deleteUser(id: string) {
    this.crudUsers
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.users.reload();
        },
      });
  }
}
