import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudSales } from '../../services/crud-sales';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-sales-dashboard',
  host: {
    class: 'flex flex-col gap-6 p-6',
  },
  imports: [CurrencyPipe, DecimalPipe, ProgressBarModule, TranslatePipe],
  templateUrl: './sales-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesDashboard {
  private crudSales = inject(CrudSales);

  dashboardResource = this.crudSales.get({ id: 'dashboard' });
  dashboard = this.dashboardResource.value;
  isLoading = this.dashboardResource.isLoading;

  revenueByStage = computed(() => this.dashboard()?.revenueByStage ?? []);
  topSalesReps = computed(() => this.dashboard()?.topSalesReps ?? []);
}
