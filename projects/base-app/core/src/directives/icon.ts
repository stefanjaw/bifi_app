/* eslint-disable @angular-eslint/directive-selector */
import { computed, Directive, effect, input } from '@angular/core';

type IconSize = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl';

@Directive({
  selector: '[bifiAppIcon]',
  host: {
    '[style]': 'fontSize()',
  },
})
export class Icon {
  size = input<IconSize>('base', { alias: 'bifiAppIcon' });

  fontSize = computed(() => {
    const size = this.size();

    switch (size) {
      case 'xs':
        return 'font-size: 0.25rem';
      case 'sm':
        return 'font-size: 0.5rem';
      case 'md':
        return 'font-size: 0.8rem';
      case 'lg':
        return 'font-size: 1.5rem';
      case 'xl':
        return 'font-size: 2rem';
      default:
        return 'font-size: 1rem';
    }
  });

  constructor() {
    effect(() => {
      const current = this.fontSize();
      console.log('updated', current);
    });
  }
}
