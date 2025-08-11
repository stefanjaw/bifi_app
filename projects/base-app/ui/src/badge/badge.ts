import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BadgeVariant } from './badge.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-app-badge',
  imports: [CommonModule],
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  variant = input<BadgeVariant>();
  text = input<string>();

  state = computed(() => {
    const variant = this.variant();

    switch (variant) {
      case 'success':
        return { class: 'bg-green-100 text-green-700' };
      case 'error':
        return { class: 'bg-red-100 text-red-700' };
      case 'info':
        return { class: 'bg-cyan-100 text-cyan-700' };
      case 'warning':
        return { class: 'bg-yellow-100 text-yellow-700' };
      default:
        return { class: '' };
    }
  });
}
