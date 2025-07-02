export interface tableColumn {
  field: string;
  parseField?: (value: any) => string;
  title: string;
  type: 'text' | 'number' | 'date' | 'image' | 'currency';
  currencySymbol?: string;
}
