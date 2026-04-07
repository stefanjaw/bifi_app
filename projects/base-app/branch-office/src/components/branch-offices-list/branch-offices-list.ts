import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudBranchOffices } from '../../services/crud-branch-offices';
import { branchOfficeColumns } from '../../libraries/branch-office-columns';
import { branchOfficeFilters } from '../../libraries/branch-office-filters';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { branchOffice } from '../../interfaces/branch-office';

@Component({
  selector: 'bifi-app-branch-offices-list',
  providers: [provideResourceManager(CrudBranchOffices)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink, ButtonsActions],  templateUrl: './branch-offices-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchOfficesList {
  private resourceManager = inject<ResourceManager<branchOffice>>(ResourceManager);
  private crudBranchOffices = inject(CrudBranchOffices);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  branchOfficeColumns = branchOfficeColumns;
  branchOfficeFilters = branchOfficeFilters;

  branchOffices = this.resourceManager.data;

  deleteBranchOffice(id: string) {
    this.crudBranchOffices
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.branchOffices.reload();
        },
      });
  }

  gotoEditBranchOffice = (element: branchOffice) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  }
}
