import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudFiscalPositions } from '../../services/crud-fiscal-positions';
import { fiscalPosition } from '../../interfaces/fiscal-position';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { fiscalPositionColumns } from '../../libraries/fiscal-position-columns';
import { fiscalPositionFilters } from '../../libraries/fiscal-position-filters';

@Component({
  selector: 'bifi-app-fiscal-positions-list',
  providers: [provideResourceManager(CrudFiscalPositions)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './fiscal-positions-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiscalPositionsList {
  private resourceManager = inject<ResourceManager<fiscalPosition>>(ResourceManager);
  private crudFiscalPositions = inject(CrudFiscalPositions);
  private destroy$ = inject(DestroyRef);

  columns = fiscalPositionColumns;
  filters = fiscalPositionFilters;
  fiscalPositions = this.resourceManager.data;

  delete(id: string) {
    this.crudFiscalPositions
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.fiscalPositions.reload(); } });
  }
}
