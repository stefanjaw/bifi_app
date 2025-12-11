import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetRosterStatusFilterManager } from '../../services/asset-roster-status-filter-manager';
import { Icon } from '@avalantec/base-app/core';
import { statusCardState, statusVariant } from '../../interfaces/asset-roster-status-card';

@Component({
  selector: 'bifi-app-asset-roster-status-card',
  imports: [CommonModule, Icon],
  templateUrl: './asset-roster-status-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterStatusCardComponent {
  protected assetRosterStatusManager = inject(AssetRosterStatusFilterManager);

  variant = input.required<statusVariant>();
  units = input.required<number>();

  state = computed<statusCardState>(() => {
    const variant = this.variant();

    switch (variant) {
      case 'under-service':
        return {
          title: 'Under Service',
          icon: 'pi pi-hammer',
          className: 'bg-orange-500 hover:bg-orange-600 ring-orange-400',
        };
      case 'overdue':
        return {
          title: 'Overdue',
          icon: 'pi pi-exclamation-triangle',
          className: 'bg-red-500 hover:bg-red-600 ring-red-400',
        };
      case 'due':
        return {
          title: 'Due',
          icon: 'pi pi-clock',
          className: ' bg-yellow-500 hover:bg-yellow-600 ring-yellow-400',
        };
      case 'in-pm':
        return {
          title: 'In PM',
          icon: 'pi pi-cog',
          className: 'bg-teal-500 hover:bg-teal-600 ring-teal-400',
        };
      case 'pm-not-set':
        return {
          title: 'PM Not Set',
          icon: 'pi pi-question',
          className: 'bg-indigo-500 hover:bg-indigo-600 ring-indigo-400',
        };
    }

    // temporal en lo que se agregan el resto
    return null!;
  });
}
