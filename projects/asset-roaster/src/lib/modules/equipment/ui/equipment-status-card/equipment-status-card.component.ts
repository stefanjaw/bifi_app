import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { statusVariant, statusCardState } from './equipment-status-card.model';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-equipment-status-card',
  imports: [CommonModule, MatIcon],
  templateUrl: './equipment-status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentStatusCardComponent {
  variant = input.required<statusVariant>();
  units = input.required<number>();

  state = computed<statusCardState>(() => {
    const variant = this.variant();

    switch (variant) {
      case 'under-service':
        return {
          title: 'Under Service',
          icon: 'warning',
          className: 'bg-orange-500 text-white',
        };
      case 'overdue':
        return {
          title: 'Overdue',
          icon: 'warning',
          className: 'bg-red-500 text-white',
        };
      case 'due':
        return {
          title: 'Due',
          icon: 'warning',
          className: 'bg-yellow-500 text-white',
        };
      case 'in-pm':
        return {
          title: 'In PM',
          icon: 'settings',
          className: 'bg-blue-500 text-white',
        };
      case 'pm-not-set':
        return {
          title: 'PM Not Set',
          icon: 'settings',
          className: 'bg-indigo-500 text-white',
        };
    }

    // temporal en lo que se agregan el resto
    return null!;
  });
}
