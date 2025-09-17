import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { CrudUsers } from '../../services/crud-users';
import { user } from '@avalantec/base-app/core';
import { userColumns } from '../../libraries/user-columns';
import { userFilters } from '../../libraries/user-filters';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';

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

  userColumns = userColumns;
  userFilters = userFilters;

  users = this.resourceManager.data;
}
