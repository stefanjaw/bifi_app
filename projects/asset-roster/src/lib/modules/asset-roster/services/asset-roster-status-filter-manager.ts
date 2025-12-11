import { effect, inject, Injectable, signal } from '@angular/core';
import { statusVariant } from '../interfaces/asset-roster-status-card';
import { filterGroup, FilterManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class AssetRosterStatusFilterManager {
  private readonly FILTER_ID = 'asset-roster-status';
  private _currentVariant = signal<statusVariant | undefined>(undefined);
  private filterManager = inject(FilterManager);

  get currentVariant() {
    return this._currentVariant.asReadonly();
  }

  constructor() {
    effect(() => {
      if (this.filterManager.filters().length === 0) this._currentVariant.set(undefined);
    });
  }

  filter(variant: statusVariant) {
    this.filterManager.removeFilter(this.FILTER_ID);

    if (variant === this._currentVariant()) {
      this._currentVariant.set(undefined);
      return;
    }

    if (
      variant === 'under-service' ||
      variant === 'decommissioned' ||
      variant === 'awaiting-commissioning' ||
      variant === 'active' ||
      variant === 'in-pm'
    )
      this.filterManager.addFilter(this.getFilterByStatus(variant));
    else if (variant === 'overdue') this.filterManager.addFilter(this.getFilterByOverdue());
    else if (variant === 'due') this.filterManager.addFilter(this.getFilterByDue());
    else if (variant === 'pm-not-set') this.filterManager.addFilter(this.getFilterByPMNotSet());

    this._currentVariant.set(variant);
  }

  //#region Creation of filter groups
  getFilterByStatus(status: string): filterGroup<any> {
    return {
      id: this.FILTER_ID,
      operator: 'and',
      filters: [{ field: 'status', value: status, operator: '==' }],
    };
  }

  getFilterByOverdue(): filterGroup<any> {
    return {
      id: this.FILTER_ID,
      operator: 'and',
      filters: [
        {
          field: 'maxMaintenanceDate',
          value: new Date().toISOString(),
          operator: '<',
        },
      ],
    };
  }

  getFilterByDue(): filterGroup<any> {
    return {
      id: this.FILTER_ID,
      operator: 'and',
      filters: [
        {
          field: 'minMaintenanceDate',
          value: new Date().toISOString(),
          operator: '<=',
        },
        {
          field: 'maxMaintenanceDate',
          value: new Date().toISOString(),
          operator: '>=',
        },
      ],
    };
  }

  getFilterByPMNotSet(): filterGroup<any> {
    return {
      id: this.FILTER_ID,
      operator: 'and',
      filters: [{ field: 'maintenanceWindowIds', operator: 'empty' }],
    };
  }
  //#endregion
}
