import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CrudInventoryDashboard } from '../../services/crud-inventory-dashboard';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-inventory-dashboard',
  host: {
    class: 'flex flex-col gap-6 p-6',
  },
  imports: [CurrencyPipe, ProgressBarModule, RouterLink, TranslatePipe],
  templateUrl: './inventory-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryDashboard {
  private crudDashboard = inject(CrudInventoryDashboard);

  private dashboardResource = this.crudDashboard.get({ id: 'dashboard' });
  dashboard = this.dashboardResource.value;
  isLoading = this.dashboardResource.isLoading;

  showOutOfStock = signal(false);
  showLowStock = signal(false);

  toggleOutOfStock() {
    this.showOutOfStock.update(v => !v);
  }

  toggleLowStock() {
    this.showLowStock.update(v => !v);
  }
}
