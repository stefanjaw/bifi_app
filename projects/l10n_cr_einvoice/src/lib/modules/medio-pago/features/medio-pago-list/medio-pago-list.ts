import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
  tableColumn,
  filter,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudMedioPago, medioPago } from '../../services/crud-medio-pago';

const columns: tableColumn<medioPago>[] = [
  { field: 'code', title: 'Code', type: 'text', sortable: true },
  { field: 'description', title: 'Description', type: 'text' },
  { field: 'active', title: 'Active', type: 'text', parseField: (v: boolean) => (v ? 'Active' : 'Inactive') },
];

const filters: filter<medioPago>[] = [
  { field: 'code', type: 'string' },
  { field: 'description', type: 'string' },
];

@Component({
  selector: 'bifi-app-medio-pago-list',
  providers: [provideResourceManager(CrudMedioPago)],
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, HasPermission, ButtonsActions],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  template: `
    <h1 class="text-2xl font-bold mb-4">Medio de Pago</h1>
    <div class="flex gap-2 mb-4">
      <p-button
        label="Add New"
        severity="secondary"
        icon="pi pi-plus"
        [routerLink]="['../create']"
        *bifiAppHasPermission="'cr-einvoice/medio-pago/create:view'"
      ></p-button>
    </div>
    <bifi-app-search-bar label="Search by code or description" [searchFilters]="filters"></bifi-app-search-bar>
    <bifi-app-table-layout
      [infiniteScroll]="true"
      [columns]="columns"
      [data]="data"
      [onClickRow]="gotoEdit"
      clickRowPermission="cr-einvoice/medio-pago/update:view"
    >
      <ng-template #actions let-row>
        <bifi-app-buttons-actions
          (deleteClicked)="delete(row._id)"
          resource="cr-einvoice/medio-pago"
        ></bifi-app-buttons-actions>
      </ng-template>
    </bifi-app-table-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedioPagoList {
  private resourceManager = inject<ResourceManager<medioPago>>(ResourceManager);
  private crud = inject(CrudMedioPago);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = columns;
  filters = filters;
  data = this.resourceManager.data;

  delete(id: string) {
    this.crud.delete({ _id: id }).pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: res => { if (res) this.data.reload(); },
    });
  }

  gotoEdit = (element: medioPago) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
