import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CrudPurchasesDashboard } from '../../services/crud-purchases-dashboard';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-purchases-dashboard',
  host: {
    class: 'flex flex-col gap-6 p-6',
  },
  imports: [CurrencyPipe, ProgressBarModule, TranslatePipe],
  templateUrl: './purchases-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasesDashboard {
  private crudDashboard = inject(CrudPurchasesDashboard);

  private dashboardResource = this.crudDashboard.get({ id: 'dashboard' });
  dashboard = this.dashboardResource.value;
  isLoading = this.dashboardResource.isLoading;
}
