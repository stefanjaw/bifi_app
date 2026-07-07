import { ChangeDetectionStrategy, Component, computed, effect, inject, model } from '@angular/core';
import { AssetRosterStatusFilterManager } from '../../services/asset-roster-status-filter-manager';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { statusVariant } from '../../interfaces/asset-roster-status-card';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-asset-roster-status-select',
  imports: [FormsModule, Select, TranslatePipe],
  host: { class: 'w-full' },
  templateUrl: './asset-roster-status-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterStatusSelect {
  protected assetRosterStatusManager = inject(AssetRosterStatusFilterManager);
  private translationService = inject(TranslationService);

  private readonly rawOptions: {
    transKey: string;
    label: string;
    variant: statusVariant | 'all';
  }[] = [
    { transKey: 'allStatuses', label: 'All Statuses', variant: 'all' },
    { transKey: 'active', label: 'Active', variant: 'active' },
    {
      transKey: 'awaitingCommissioning',
      label: 'Awaiting commissioning',
      variant: 'awaiting-commissioning',
    },
    { transKey: 'underService', label: 'Under Service', variant: 'under-service' },
    { transKey: 'decommissioned', label: 'Decommissioned', variant: 'decommissioned' },
    { transKey: 'due', label: 'Due', variant: 'due' },
    { transKey: 'overdue', label: 'Overdue', variant: 'overdue' },
    { transKey: 'inPm', label: 'In PM', variant: 'in-pm' },
    { transKey: 'pmNotSet', label: 'PM Not Set', variant: 'pm-not-set' },
  ];

  protected options = computed(() =>
    this.rawOptions.map(opt => ({
      ...opt,
      label: this.translationService.translate(opt.transKey, {}, 'asset-roster'),
    }))
  );

  variant = model<statusVariant | 'all'>(this.assetRosterStatusManager.currentVariant() || 'all');

  constructor() {
    effect(() => {
      this.variant.set(this.assetRosterStatusManager.currentVariant() || 'all');
    });
  }
}
