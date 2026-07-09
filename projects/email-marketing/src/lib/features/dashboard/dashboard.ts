import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudEmailCampaigns } from '../../services/crud-email-campaigns';
import { emailDashboard } from '../../interfaces/email-event';

@Component({
  selector: 'bifi-app-email-dashboard',
  imports: [RouterLink, ButtonModule, CardModule, ProgressBarModule, TranslatePipe],
  host: {
    class: 'block p-6',
  },
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailDashboard {
  private crudCampaigns = inject(CrudEmailCampaigns);

  protected dashboardResource = this.crudCampaigns.getDashboard();
  protected loading = this.dashboardResource.isLoading;

  protected data = computed<emailDashboard>(() => {
    const value = this.dashboardResource.value();
    if (value?.totals) return value;
    return {
      totals: { campaigns: 0, subscribers: 0, lists: 0, templates: 0 },
      aggregateStats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
      },
      recentCampaigns: [],
    };
  });

  protected openRate = computed(() => {
    const s = this.data().aggregateStats;
    if (!s || !s.delivered) return 0;
    return Math.round((s.opened / s.delivered) * 100);
  });

  protected clickRate = computed(() => {
    const s = this.data().aggregateStats;
    if (!s || !s.delivered) return 0;
    return Math.round((s.clicked / s.delivered) * 100);
  });
}
