/**
 * FilterBar — stackable advanced filter component.
 *
 * @example
 * // 1. Define available filter fields (in your list component)
 * filterFields: filterFieldConfig<MyEntity>[] = [
 *   { field: 'name',      label: 'Name',        type: 'string'  },
 *   { field: 'amount',    label: 'Amount',       type: 'number'  },
 *   { field: 'createdAt', label: 'Created date', type: 'date'    },
 *   { field: 'active',    label: 'Active',       type: 'boolean' },
 * ];
 *
 * // 2. Drop the component into the template (alongside SearchBar if needed):
 * <bifi-app-filter-bar [filterFields]="filterFields" />
 *
 * Requires the host component (or a parent) to provide provideResourceManager().
 * Each active, complete row is combined with AND logic and pushed to FilterManager
 * under the stable group id 'filter-bar', so it coexists with SearchBar filters.
 */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterManager } from '../../services/filter-manager';
import { filter, filterFieldConfig } from '../../interfaces/filter';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

interface FilterRow {
  id: string;
  field: string | null;
  operator: filter['operator'] | null;
  value: any;
  type: 'string' | 'number' | 'date' | 'boolean' | null;
}

const OPERATORS_BY_TYPE: Record<string, { label: string; value: filter['operator'] }[]> = {
  string: [
    { label: 'Contains', value: 'like' },
    { label: 'Does not contain', value: 'not like' },
    { label: 'Equals', value: '==' },
    { label: 'Not equals', value: '!=' },
    { label: 'Is empty', value: 'empty' },
  ],
  number: [
    { label: 'Equals', value: '==' },
    { label: 'Not equals', value: '!=' },
    { label: 'Greater than', value: '>' },
    { label: 'Less than', value: '<' },
    { label: 'Greater or equal', value: '>=' },
    { label: 'Less or equal', value: '<=' },
  ],
  date: [
    { label: 'On', value: '==' },
    { label: 'After', value: '>' },
    { label: 'Before', value: '<' },
    { label: 'After or on', value: '>=' },
    { label: 'Before or on', value: '<=' },
    { label: 'Not on', value: '!=' },
  ],
  boolean: [{ label: 'Is', value: '==' }],
};

@Component({
  selector: 'bifi-app-filter-bar',
  imports: [
    FormsModule,
    SelectModule,
    InputText,
    InputNumberModule,
    DatePickerModule,
    CheckboxModule,
    ButtonModule,
  ],
  templateUrl: './filter-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBar implements OnDestroy {
  private readonly FILTER_ID = 'filter-bar';

  private filterManager = inject(FilterManager);

  filterFields = input<filterFieldConfig<any>[]>([]);

  rows = signal<FilterRow[]>([]);

  fieldOptions = computed(() =>
    this.filterFields().map(f => ({ label: f.label, value: f.field as string }))
  );

  operatorsFor(type: string | null): { label: string; value: filter['operator'] }[] {
    if (!type) return [];
    return OPERATORS_BY_TYPE[type] ?? [];
  }

  constructor() {
    effect(() => {
      const rows = this.rows();
      const completeRows = rows.filter(
        r =>
          r.field &&
          r.operator &&
          (r.operator === 'empty' || (r.value !== null && r.value !== undefined && r.value !== ''))
      );

      this.filterManager.removeFilter(this.FILTER_ID);

      if (completeRows.length > 0) {
        const filters: filter<any>[] = completeRows.map(r => ({
          field: r.field as string,
          operator: r.operator!,
          type: r.type as any,
          ...(r.operator !== 'empty' && {
            value: r.value instanceof Date ? r.value.toISOString() : r.value,
          }),
        }));

        this.filterManager.addFilter({
          id: this.FILTER_ID,
          operator: 'and',
          filters,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.filterManager.removeFilter(this.FILTER_ID);
  }

  addRow(): void {
    this.rows.update(rows => [
      ...rows,
      { id: crypto.randomUUID(), field: null, operator: null, value: null, type: null },
    ]);
  }

  removeRow(id: string): void {
    this.rows.update(rows => rows.filter(r => r.id !== id));
  }

  clearRows(): void {
    this.rows.set([]);
  }

  onFieldChange(rowId: string, fieldName: string | null): void {
    const fieldConfig = this.filterFields().find(f => (f.field as string) === fieldName);
    this.rows.update(rows =>
      rows.map(r =>
        r.id === rowId
          ? { ...r, field: fieldName, operator: null, value: null, type: fieldConfig?.type ?? null }
          : r
      )
    );
  }

  onOperatorChange(rowId: string, operator: filter['operator'] | null): void {
    this.rows.update(rows =>
      rows.map(r => (r.id === rowId ? { ...r, operator, value: null } : r))
    );
  }

  onValueChange(rowId: string, value: any): void {
    this.rows.update(rows => rows.map(r => (r.id === rowId ? { ...r, value } : r)));
  }
}
