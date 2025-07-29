import { effect, inject, Injectable, signal } from '@angular/core';
import { statusVariant } from '../interfaces/product-status-card';
import { filterGroup, FilterManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class ProductStatusFilterManager {
  private readonly filterId = 'product-status';
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

  /**
   * Set the filter for the given product status variant.
   *
   * If the given variant is the same as the current variant, the filter is removed.
   * If the given variant is different, it will be set as the filter.
   *
   * @param variant The product status variant to filter by.
   **/
  filter(variant: statusVariant) {
    this.filterManager.removeFilter(this.filterId);

    if (variant === this._currentVariant()) {
      this._currentVariant.set(undefined);
      return;
    }

    if (
      variant === 'under-service' ||
      variant === 'decomissioned' ||
      variant === 'awaiting-comissioning' ||
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

  /**
   * Return a filter group for the given status.
   *
   * @param status The product status to filter by.
   * @returns A filter group with id {@link filterId} containing a filter for the
   * 'status' field with value {@link status} and operator '=='.
   **/
  getFilterByStatus(status: string): filterGroup<any> {
    return {
      id: this.filterId,
      operator: 'and',
      filters: [{ field: 'status', value: status, operator: '==' }],
    };
  }

  /**
   * Return a filter group that filters products where the maximum maintenance date is overdue.
   *
   * The filter group returned by this method has id {@link filterId}, operator 'and',
   * and a single filter with field 'maxMaintenanceDate', value the current date and time
   * as an ISO string, and operator '<'. This will filter out all products where the
   * maximum maintenance date is not overdue.
   *
   * @returns A filter group with id {@link filterId} containing a filter for the
   * 'maxMaintenanceDate' field with value the current date and time as an ISO string
   * and operator '<'.
   **/
  getFilterByOverdue(): filterGroup<any> {
    return {
      id: this.filterId,
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

  /**
   * Return a filter group that filters products where the maintenance date is due.
   *
   * The filter group returned by this method has id {@link filterId}, operator 'and',
   * and two filters: one for the 'minMaintenanceDate' field with a value of the current
   * date and time as an ISO string and operator '<=', and another for the 'maxMaintenanceDate'
   * field with the same value and operator '>='. This will filter out all products where the
   * maintenance date is not due.
   *
   * @returns A filter group with id {@link filterId} containing filters for the
   * 'minMaintenanceDate' and 'maxMaintenanceDate' fields with the current date and time as
   * their value and appropriate operators.
   **/

  getFilterByDue(): filterGroup<any> {
    return {
      id: this.filterId,
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

  /**
   * Return a filter group that filters products where the maintenance window is not set.
   *
   * The filter group returned by this method has id {@link filterId}, operator 'and',
   * and a single filter with field 'maintenanceWindowIds', operator 'empty'. This will
   * filter out all products where the maintenance window is set.
   *
   * @returns A filter group with id {@link filterId} containing a filter for the
   * 'maintenanceWindowIds' field with operator 'empty'.
   **/
  getFilterByPMNotSet(): filterGroup<any> {
    return {
      id: this.filterId,
      operator: 'and',
      filters: [{ field: 'maintenanceWindowIds', operator: 'empty' }],
    };
  }
  //#endregion
}
