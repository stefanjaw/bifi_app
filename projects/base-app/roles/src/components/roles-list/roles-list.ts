import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudRoles } from '../../services/crud-roles';
import { ButtonModule } from 'primeng/button';
import { roleColumns } from '../../libraries/role-columns';
import { roleFilters } from '../../libraries/role-filters';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { role } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-roles-list',
  providers: [provideResourceManager(CrudRoles)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './roles-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesList {
  private resourceManager = inject<ResourceManager<role>>(ResourceManager);
  private crudRoles = inject(CrudRoles);
  private destroy$ = inject(DestroyRef);

  roleColumns = roleColumns;
  roleFilters = roleFilters;

  roles = this.resourceManager.data;

  deleteRole(id: string) {
    this.crudRoles
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.roles.reload();
        },
      });
  }
}
