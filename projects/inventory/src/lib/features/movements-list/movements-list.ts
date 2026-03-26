import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudMovements } from '../../services/crud-movements';
import { stockMovement } from '../../interfaces/stock-movement';
import { movementColumns } from '../../libraries/movement-columns';
import { movementFilters } from '../../libraries/movement-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bifi-app-movements-list',
  providers: [provideResourceManager(CrudMovements)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, HasPermission],
  templateUrl: './movements-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementsList {
  private resourceManager = inject<ResourceManager<stockMovement>>(ResourceManager);

  movementColumns = movementColumns;
  movementFilters = movementFilters;
  entries = this.resourceManager.data;
}
