import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
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
import { maintenanceWindowColumns } from '../../libraries/maintenance-window-columns';
import { maintenanceWindowFilters } from '../../libraries/maintenance-window-filters';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-maintenance-windows-list',
  providers: [provideResourceManager(CrudMaintenanceWindows)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './maintenance-windows-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceWindowsList {
  private resourceManager = inject<ResourceManager<maintenanceWindow>>(ResourceManager);
  private crudMaintenanceWindows = inject(CrudMaintenanceWindows);
  private destroy$ = inject(DestroyRef);

  maintenanceWindowColumns = maintenanceWindowColumns;
  maintenanceWindowFilters = maintenanceWindowFilters;

  maintenanceWindows = this.resourceManager.data;
  
  deleteMaintenanceWindow(id: string) {
    this.crudMaintenanceWindows
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.maintenanceWindows.reload();
        },
      });
  }
}
  