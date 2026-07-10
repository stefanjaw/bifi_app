import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudPaymentTerms } from '../../services/crud-payment-terms';
import { paymentTerm } from '../../interfaces/payment-term';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { paymentTermColumns } from '../../libraries/payment-term-columns';
import { paymentTermFilters } from '../../libraries/payment-term-filters';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-payment-terms-list',
  providers: [provideResourceManager(CrudPaymentTerms)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, ButtonModule, HasPermission, RouterLink, ButtonsActions, TranslatePipe],
  templateUrl: './payment-terms-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTermsList {
  private resourceManager = inject<ResourceManager<paymentTerm>>(ResourceManager);
  private crudPaymentTerms = inject(CrudPaymentTerms);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = paymentTermColumns;
  filters = paymentTermFilters;
  paymentTerms = this.resourceManager.data;

  delete(id: string) {
    this.crudPaymentTerms
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.paymentTerms.reload();
        },
      });
  }

  gotoEditPaymentTerm = (element: paymentTerm) => {
    this.router.navigate(['../payment-terms/edit', element._id], { relativeTo: this.route });
  };
}
