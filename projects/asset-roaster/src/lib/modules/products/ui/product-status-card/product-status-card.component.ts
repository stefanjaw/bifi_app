import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import {
  statusVariant,
  statusCardState,
} from '@avalantec/asset-roaster/modules/products/interfaces/product-status-card';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ProductStatusManager } from '../../services/product-status-manager';

@Component({
  selector: 'bifi-app-product-status-card',
  imports: [CommonModule, MatIcon],
  templateUrl: './product-status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductStatusCardComponent {
  protected productStatusManager = inject(ProductStatusManager);

  variant = input.required<statusVariant>();
  units = input.required<number>();

  state = computed<statusCardState>(() => {
    const variant = this.variant();

    switch (variant) {
      case 'under-service':
        return {
          title: 'Under Service',
          icon: 'handyman',
          className: 'bg-orange-500 hover:bg-orange-600 ring-orange-400',
        };
      case 'overdue':
        return {
          title: 'Overdue',
          icon: 'warning',
          className: 'bg-red-500 hover:bg-red-600 ring-red-400',
        };
      case 'due':
        return {
          title: 'Due',
          icon: 'access_time',
          className: ' bg-yellow-500 hover:bg-yellow-600 ring-yellow-400',
        };
      case 'in-pm':
        return {
          title: 'In PM',
          icon: 'settings',
          className: 'bg-teal-500 hover:bg-teal-600 ring-teal-400',
        };
      case 'pm-not-set':
        return {
          title: 'PM Not Set',
          icon: 'question_mark',
          className: 'bg-indigo-500 hover:bg-indigo-600 ring-indigo-400',
        };
    }

    // temporal en lo que se agregan el resto
    return null!;
  });
}
