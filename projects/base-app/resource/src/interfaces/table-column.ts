import { TemplateRef } from '@angular/core';
import { DynamicComponent } from './dynamic-component';
import { deepKeys } from '@avalantec/base-app/core';

export interface tableColumn<T extends Record<string, any> = Record<string, any>> {
  field: deepKeys<T>;
  parseField?: (value: any) => string;
  sortable?: boolean;
  title: string;
  type: 'text' | 'number' | 'date' | 'image' | 'currency';
  component?: DynamicComponent | ((row: T) => DynamicComponent);
  template?: TemplateRef<any>;
  currencySymbol?: string;
}
