import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudShippings } from '../../services/crud-shippings';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { RouterLink } from '@angular/router';
import { shipping } from '../../interfaces/shipping';
// import { shippingColumns } from '../../libraries/shipping-columns';
import { shippingFilters } from '../../libraries/shipping-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { shippingColumns } from '../../libraries/shipping-columns';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'bifi-app-shippings-list',
  providers: [provideResourceManager(CrudShippings)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    SearchBar,
    ButtonModule,
    HasPermission,
    RouterLink,
    TableModule,
    TableLayout,
    CommonModule,
    Tag,
  ],
  templateUrl: './shippings-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingsList {
  private resourceManager = inject<ResourceManager<shipping>>(ResourceManager);
  private crudShippings = inject(CrudShippings);
  private destroy$ = inject(DestroyRef);

  shippingColumns = shippingColumns;
  shippingFilters = shippingFilters;

  shippings = this.resourceManager.data;

  accordionMap = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const shippings = this.shippings.value();
      const map: Record<string, boolean> = {};

      if (shippings?.docs) {
        shippings.docs.forEach(s => (map[s._id] = false));
      }

      this.accordionMap.set(map);
    });
  }

  toggleAccordion(_id: string) {
    this.accordionMap.update(v => {
      v[_id] = !v[_id];
      return v;
    });
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'PDF_PROCESSED':
        return 'success';

      case 'ERROR':
        return 'warn';

      case 'UPLOADING':
        return 'info';

      default:
        return 'success';
    }
  }
  deleteShipping(id: string) {
    this.crudShippings
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.shippings.reload();
        },
      });
  }
}
