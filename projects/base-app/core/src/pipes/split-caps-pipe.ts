import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitCaps',
})
export class SplitCapsPipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return '';
    return value.replace(/([A-Z])/g, ' $1').trim();
  }
}
