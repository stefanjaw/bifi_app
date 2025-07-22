import { Injectable, signal } from '@angular/core';
import { orderByQuery } from '../interfaces/order-by';

@Injectable({
  providedIn: 'root',
})
export class SortManager<T> {
  private _sort = signal<orderByQuery<T>>([]);

  get sort() {
    return this._sort.asReadonly();
  }

  /**
   * Updates the sorting criteria based on the provided field and order direction.
   *
   * This method takes a field name and an order direction to set the sorting
   * criteria. The sorting criteria will consist of a single field and its
   * corresponding order direction.
   *
   * @param {Object} param - An object containing the sorting parameters.
   * @param {never} param.fieldName - The name of the field to sort by. (Note: `never` type may need updating)
   * @param {orderDirection} param.value - The order direction ('asc' or 'desc').
   */

  sortBy(sortQuery: orderByQuery<T>) {
    this._sort.set(sortQuery);
  }

  /**
   * Resets the sorting criteria to its default state.
   *
   * This method clears the list of sorting fields, effectively removing
   * any applied sorting order.
   */

  resetSorts() {
    this._sort.set([]);
  }
}
