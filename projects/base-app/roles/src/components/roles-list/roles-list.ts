import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudRoles } from '../../services/crud-roles';
import { ButtonModule } from 'primeng/button';
import { roleColumns } from '../../libraries/role-columns';
import { roleFilters } from '../../libraries/role-filters';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission, permission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { role } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-roles-list',
  providers: [provideResourceManager(CrudRoles)],
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
  templateUrl: './roles-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesList {
  private resourceManager = inject<ResourceManager<role>>(ResourceManager);
  private crudRoles = inject(CrudRoles);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleColumns = roleColumns;
  roleFilters = roleFilters;

  roles = this.resourceManager.data;
  isImporting = signal(false);
  clickRowPermission = input<permission | undefined>(undefined);

  goToEditRole = (element: role) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  /** Downloads all roles as a CSV file. */
  exportCsv() {
    this.crudRoles.exportCSV();
  }
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

  /**
   * Uploads the selected CSV to POST /roles/import.
   * The backend import upserts on the model's unique index: existing rows are
   * updated, missing rows are created, and duplicated rows within the file
   * collapse (last one wins).
   * @param event - The file input change event carrying the selected CSV.
   */
  importCsv(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    // Reset the input so picking the same file again still fires change.
    input.value = '';

    if (!file) return;

    this.isImporting.set(true);

    this.crudRoles
      .post({ data: { csv: file }, specificEndpoint: 'import' })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isImporting.set(false);
          this.roles.reload();
        },
        error: () => {
          this.isImporting.set(false);
        },
      });
  }
}
