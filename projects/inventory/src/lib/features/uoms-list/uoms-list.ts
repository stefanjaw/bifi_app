import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudUoms } from '../../services/crud-uoms';
import { uom } from '../../interfaces/uom';
import { uomColumns } from '../../libraries/uom-columns';
import { uomFilters } from '../../libraries/uom-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-uoms-list',
  providers: [provideResourceManager(CrudUoms)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink],
  templateUrl: './uoms-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UomsList {
  private resourceManager = inject<ResourceManager<uom>>(ResourceManager);
  private crudUoms = inject(CrudUoms);
  private destroy$ = inject(DestroyRef);

  uomColumns = uomColumns;
  uomFilters = uomFilters;

  entries = this.resourceManager.data;

  delete(id: string) {
    this.crudUoms
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.entries.reload() });
  }
}
