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
import { ListStateManager, SerializableFilterRow } from '../../services/list-state-manager';
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

export interface FilterChip {
  id: string;
  fieldLabel: string;
  operatorLabel: string;
  valueText: string;
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
  private listStateManager = inject(ListStateManager);

  filterFields = input<filterFieldConfig<any>[]>([]);

  rows = signal<FilterRow[]>([]);

  fieldOptions = computed(() =>
    this.filterFields().map(f => ({
      label: f.label,
      value: f.field as string,
    }))
  );

  // ✅ Helper to determine if a row is valid
  private isRowComplete(r: FilterRow): boolean {
    return (
      !!r.field &&
      !!r.operator &&
      (r.operator === 'empty' ||
        r.type === 'boolean' || // ✅ boolean always valid (true/false)
        (r.value !== null && r.value !== undefined && r.value !== ''))
    );
  }

  activeChips = computed<FilterChip[]>(() => {
    const fields = this.filterFields();

    return this.rows()
      .filter(r => this.isRowComplete(r))
      .map(r => {
        const fieldConfig = fields.find(f => (f.field as string) === r.field);
        const operatorOptions = r.type ? (OPERATORS_BY_TYPE[r.type] ?? []) : [];
        const opEntry = operatorOptions.find(o => o.value === r.operator);

        let valueText = '';
        if (r.operator !== 'empty') {
          if (r.value instanceof Date) {
            valueText = r.value.toLocaleDateString();
          } else if (typeof r.value === 'boolean') {
            valueText = r.value ? 'Yes' : 'No';
          } else {
            valueText = String(r.value ?? '');
          }
        }

        return {
          id: r.id,
          fieldLabel: fieldConfig?.label ?? r.field ?? '',
          operatorLabel: opEntry?.label ?? r.operator ?? '',
          valueText,
        };
      });
  });

  operatorsFor(type: string | null) {
    if (!type) return [];
    return OPERATORS_BY_TYPE[type] ?? [];
  }

  constructor() {
    // Restore rows from pending state set by ResourceManager on init
    const pending = this.listStateManager.pendingRestore;
    if (pending?.filterRows?.length) {
      this.rows.set(
        pending.filterRows.map(r => ({
          ...(r as Omit<FilterRow, 'id'>),
          id: crypto.randomUUID(),
          // Parse ISO date strings back to Date objects
          value: r.type === 'date' && r.value ? new Date(r.value) : r.value,
        }))
      );
    }

    // Update FilterManager whenever rows change
    effect(() => {
      const rows = this.rows();

      const completeRows = rows.filter(r => this.isRowComplete(r));

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

      // Keep partialSave up to date so ResourceManager can sync to URL and localStorage
      this.listStateManager.savePartialState({
        filterRows: rows.map<SerializableFilterRow>(r => ({
          field: r.field,
          operator: r.operator ?? null,
          value: r.value instanceof Date ? r.value.toISOString() : r.value,
          type: r.type,
        })),
      });
    });
  }

  ngOnDestroy(): void {
    this.filterManager.removeFilter(this.FILTER_ID);
  }

  addRow(): void {
    this.rows.update(rows => [
      ...rows,
      {
        id: crypto.randomUUID(),
        field: null,
        operator: null,
        value: null,
        type: null,
      },
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
      rows.map(r => {
        if (r.id !== rowId) return r;

        const isBoolean = fieldConfig?.type === 'boolean';

        return {
          ...r,
          field: fieldName,
          type: fieldConfig?.type ?? null,
          operator: isBoolean ? '==' : null, // ✅ auto operator
          value: isBoolean ? true : null, // ✅ default TRUE
        };
      })
    );
  }

  onOperatorChange(rowId: string, operator: filter['operator'] | null): void {
    this.rows.update(rows =>
      rows.map(r => {
        if (r.id !== rowId) return r;

        let value: any = null;

        if (r.type === 'boolean') {
          value = true; // ✅ ensure default true
        }

        return { ...r, operator, value };
      })
    );
  }

  onValueChange(rowId: string, value: any): void {
    this.rows.update(rows => rows.map(r => (r.id === rowId ? { ...r, value } : r)));
  }
}
