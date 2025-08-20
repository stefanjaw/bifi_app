import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudRoles } from '../../services/crud-roles';
import { ButtonModule } from 'primeng/button';
import { role } from '@avalantec/base-app/core';
import { roleColumns } from '../../libraries/role-columns';
import { roleFilters } from '../../libraries/role-filters';

@Component({
  selector: 'bifi-app-roles-list',
  providers: [provideResourceManager(CrudRoles)],
  imports: [TableLayout, ButtonModule, SearchBar],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './roles-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesList {
  private resourceManager = inject<ResourceManager<role>>(ResourceManager);

  roleColumns = roleColumns;
  roleFilters = roleFilters;

  roles = this.resourceManager.data;
}
