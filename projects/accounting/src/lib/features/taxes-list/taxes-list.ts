import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudTaxes } from '@avalantec/base-app/taxes';
import { tax } from '../../interfaces/tax';
import {
  ButtonsActions,
  filter,
  provideResourceManager,
  ResourceManager,
  tableColumn,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { taxColumns, taxFilters } from '@avalantec/base-app/taxes';

@Component({
  selector: 'bifi-app-taxes-list',
  providers: [provideResourceManager(CrudTaxes)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, ButtonModule, HasPermission, RouterLink, ButtonsActions],
  templateUrl: './taxes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxesList {
  private resourceManager = inject<ResourceManager<tax>>(ResourceManager);
  private crudTaxes = inject(CrudTaxes);
  private destroy$ = inject(DestroyRef);

  // Router
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = taxColumns as unknown as tableColumn<tax>[];
  filters = taxFilters as unknown as filter<tax>[];
  taxes = this.resourceManager.data;

  goToEditTax = (element: tax) => {
    this.router.navigate(['../taxes/edit/', element._id], { relativeTo: this.route });
  };

  delete(id: string) {
    this.crudTaxes
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.taxes.reload();
        },
      });
  }
}
