import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudPolicies } from '../../services/crud-policies';
import { ButtonModule } from 'primeng/button';
import { policyColumns } from '../../libraries/policy-columns';
import { policyFilters } from '../../libraries/policy-filters';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { policy } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-policies-list',
  providers: [provideResourceManager(CrudPolicies)],
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
  templateUrl: './policies-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesList {
  private resourceManager = inject<ResourceManager<policy<string, string>>>(ResourceManager);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private crudPolicies = inject(CrudPolicies);
  private destroy$ = inject(DestroyRef);

  policyColumns = policyColumns;
  policyFilters = policyFilters;

  policies = this.resourceManager.data;
  isImporting = signal(false);

  gotoEditPolicy = (element: policy<string, string>) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
  deletePolicy(id: string) {
    this.crudPolicies
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.policies.reload();
        },
      });
  }

  goToCreate() {
    this.router.navigate(['create'], { relativeTo: this.route.parent });
  }

  goToEdit(_id: string) {
    this.router.navigate(['edit', _id], { relativeTo: this.route.parent });
  }

  /** Downloads all policies as a CSV file. */
  exportCsv() {
    this.crudPolicies.exportCSV();
  }

  /**
   * Uploads the selected CSV to POST /policies/import.
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

    this.crudPolicies
      .post({ data: { csv: file }, specificEndpoint: 'import' })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isImporting.set(false);
          this.policies.reload();
        },
        error: () => {
          this.isImporting.set(false);
        },
      });
  }
}
