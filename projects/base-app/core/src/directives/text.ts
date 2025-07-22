/* eslint-disable @angular-eslint/directive-selector */
import { computed, Directive, effect, input } from '@angular/core';

export type TextSize = 'title-1' | 'title-2' | 'title-3' | 'paragraph' | 'small';

@Directive({
  selector: '[bifiAppText]',
  host: {
    '[style]': 'textSize()',
  },
})
export class Text {
  size = input<TextSize>('paragraph', { alias: 'appText' });

  textSize = computed(() => {
    const size = this.size();

    switch (size) {
      case 'title-1':
        return 'font-size: 2rem; font-weight: 600';
      case 'title-2':
        return 'font-size: 1.5rem; font-weight: 600';
      case 'title-3':
        return 'font-size: 1.25rem; font-weight: 600';
      case 'paragraph':
        return 'font-size: 1rem; font-weight: 400';
      case 'small':
        return 'font-size: 0.75rem; font-weight: 400';
      default:
        return 'font-size: 1rem; font-weight: 400';
    }
  });

  constructor() {
    effect(() => {
      const current = this.textSize();
      console.log('updated', current);
    });
  }
}
