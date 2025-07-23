import { inject, Injectable, signal } from '@angular/core';
import { statusVariant } from '../interfaces/product-status-card';
import { FilterManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class ProductStatusManager {
  private readonly filterId = 'product-status';
  private _currentVariant = signal<statusVariant | undefined>(undefined);
  private filterManager = inject(FilterManager);

  get currentVariant() {
    return this._currentVariant.asReadonly();
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
      this.filterByStatus(variant);
    else if (variant === 'overdue') this.filterByOverdue();
    else if (variant === 'due') this.filterByDue();
    else if (variant === 'pm-not-set') this.filterByPMNotSet();

    this._currentVariant.set(variant);
  }

  /**
   * Filter the products by given status.
   *
   * Emits a filter group with id {@link filterId} containing a filter for the
   * 'status' field with value {@link status} and operator '=='.
   *
   * @param status The status to filter by.
   */
  private filterByStatus(status: string) {
    this.filterManager.addFilter({
      id: this.filterId,
      operator: 'and',
      filters: [{ field: 'status', value: status, operator: '==' }],
    });
  }

  /**
   * Filter the products by overdue status.
   *
   * Emits a filter group with id {@link filterId} containing a filter for the
   * 'maxMaintenanceDate' field with value {@link Date.now()} and operator '>'.
   */
  private filterByOverdue() {
    this.filterManager.addFilter({
      id: this.filterId,
      operator: 'and',
      filters: [
        {
          field: 'maxMaintenanceDate',
          value: new Date().toISOString(),
          operator: '>',
        },
      ],
    });
  }

  /**
   * Filter the products by due status.
   *
   * Emits a filter group with id {@link filterId} containing filters for the
   * 'minMaintenanceDate' and 'maxMaintenanceDate' fields with value {@link Date.now()} and
   * operators '>=' and '<=' respectively.
   */
  private filterByDue() {
    this.filterManager.addFilter({
      id: this.filterId,
      operator: 'and',
      filters: [
        {
          field: 'minMaintenanceDate',
          value: new Date().toISOString(),
          operator: '>=',
        },
        {
          field: 'maxMaintenanceDate',
          value: new Date().toISOString(),
          operator: '<=',
        },
      ],
    });
  }

  /**
   * Filter the products by PM not set status.
   *
   * Emits a filter group with id {@link filterId} containing a filter for the
   * 'maintenanceWindowIds' field with operator 'empty'.
   */
  private filterByPMNotSet() {
    this.filterManager.addFilter({
      id: this.filterId,
      operator: 'and',
      filters: [{ field: 'maintenanceWindowIds', operator: 'empty' }],
    });
  }
}
