import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudAccounts } from '../../services/crud-accounts';
import { account } from '../../interfaces/account';
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
import { accountColumns } from '../../libraries/account-columns';
import { accountFilters } from '../../libraries/account-filters';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-accounts-list',
  providers: [provideResourceManager(CrudAccounts)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, ButtonModule, HasPermission, RouterLink, ButtonsActions, TranslatePipe],
  templateUrl: './accounts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsList {
  private resourceManager = inject<ResourceManager<account>>(ResourceManager);
  private crudAccounts = inject(CrudAccounts);
  private destroy$ = inject(DestroyRef);

  // Router
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = accountColumns;
  filters = accountFilters;
  accounts = this.resourceManager.data;

  goToEditAccount = (element: account) => {
    this.router.navigate(['../accounts/edit/', element._id], { relativeTo: this.route });
  };
  deleteAccount(id: string) {
    this.crudAccounts
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.accounts.reload();
        },
      });
  }
}
