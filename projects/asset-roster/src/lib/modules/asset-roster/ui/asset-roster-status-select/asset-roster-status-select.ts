import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { AssetRosterStatusFilterManager } from '../../services/asset-roster-status-filter-manager';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { statusVariant } from '../../interfaces/asset-roster-status-card';

@Component({
  selector: 'bifi-app-asset-roster-status-select',
  imports: [FormsModule, Select],
  host: { class: 'w-full' },
  templateUrl: './asset-roster-status-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterStatusSelect {
  protected assetRosterStatusManager = inject(AssetRosterStatusFilterManager);
  protected readonly options: { label: string; variant: statusVariant | 'all' }[] = [
    {
      label: 'All Statuses',
      variant: 'all',
    },
    {
      label: 'Active',
      variant: 'active',
    },
    {
      label: 'Awaiting commissioning',
      variant: 'awaiting-commissioning',
    },
    {
      label: 'Under Service',
      variant: 'under-service',
    },
    {
      label: 'Decommissioned',
      variant: 'decommissioned',
    },
    {
      label: 'Due',
      variant: 'due',
    },
    {
      label: 'Overdue',
      variant: 'overdue',
    },

    {
      label: 'In PM',
      variant: 'in-pm',
    },
    {
      label: 'PM Not Set',
      variant: 'pm-not-set',
    },
  ];

  variant = model<statusVariant | 'all'>(this.assetRosterStatusManager.currentVariant() || 'all');

  constructor() {
    effect(() => {
      this.variant.set(this.assetRosterStatusManager.currentVariant() || 'all');
    });
  }
}
