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

  state = computed<statusCardState>(() => {
    const variant = this.variant();

    switch (variant) {
      case 'under-service':
        return {
          title: 'Under Service',
          icon: 'warning',
          className: 'bg-orange-500 text-white',
        };
    }

    // temporal en lo que se agregan el resto
    return null!;
  });
}
