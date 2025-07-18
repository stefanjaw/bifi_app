import { TemplateRef } from '@angular/core';
import { deepKeys } from './deep-keys';
import { DynamicComponent } from './dynamic-component';

export interface tableColumn<
  T extends Record<string, any> = Record<string, any>,
> {
  field: deepKeys<T>;
  parseField?: (value: any) => string;
  title: string;
  type: 'text' | 'number' | 'date' | 'image' | 'currency';
  component?: DynamicComponent | ((row: T) => DynamicComponent);
  template?: TemplateRef<any>;
  currencySymbol?: string;
}
