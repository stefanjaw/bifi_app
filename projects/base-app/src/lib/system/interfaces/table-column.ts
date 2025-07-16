import { TemplateRef } from '@angular/core';
import { deepKeys } from './deep-keys';

export interface tableColumn<
  T extends Record<string, any> = Record<string, any>,
> {
  field: deepKeys<T>;
  parseField?: (value: T) => string;
  title: string;
  type: 'text' | 'number' | 'date' | 'image' | 'currency';
  template?: TemplateRef<any>;
  currencySymbol?: string;
}
