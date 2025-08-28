import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudMaintenanceWindows } from '../../services/crud-maintenance-windows';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { maintenanceWindow } from '../../interfaces/maintenance-window';
import { maintenanceWindowColumns } from '../../libraries/maintenace-window-columns';
import { maintenanceWindowFilters } from '../../libraries/maintenance-window-filters';

@Component({
  selector: 'bifi-app-maintenance-windows-list',
  providers: [provideResourceManager(CrudMaintenanceWindows)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './maintenance-windows-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceWindowsList {
  private resourceManager = inject<ResourceManager<maintenanceWindow>>(ResourceManager);

  maintenanceWindowColumns = maintenanceWindowColumns;
  maintenanceWindowFilters = maintenanceWindowFilters;

  maintenanceWindows = this.resourceManager.data;
}
