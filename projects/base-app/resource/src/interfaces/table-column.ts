import { TemplateRef } from '@angular/core';
import { DynamicComponentConfig } from './dynamic-component';
import { deepKeys } from '@avalantec/base-app/core';

export interface tableColumn<T extends Record<string, any> = Record<string, any>> {
  field: deepKeys<T>;
  parseField?: (value: any) => string;
  sortable?: boolean;
  title: string;
  type: 'text' | 'number' | 'date' | 'image' | 'currency';
  component?: DynamicComponentConfig | ((row: T) => DynamicComponentConfig);
  template?: TemplateRef<any>;
  currencySymbol?: string;
}
