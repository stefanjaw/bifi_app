import { Injectable, signal } from '@angular/core';
import { filter, filterOperator } from '../interfaces/filter';

@Injectable({
  providedIn: 'root',
})
export class FilterManager {
  protected _filters = signal<filter[]>([]);

  get filters() {
    return this._filters;
  }

  //#region Filter managament

  /**
   * Adds a new filter to the current filters.
   *
   * Appends the given filter to the end of the current filters array.
   * @param newFilter The filter object to add to the current filters.
   */
  addFilter(newFilter: filter) {
    this._filters.update((filters) => [...filters, newFilter]);
  }

  /**
   * Removes a filter from the current filters.
   *
   * Iterates over the current filters and removes the first filter that has the given field.
   * @param field The field of the filter to be removed.
   */
  removeFilter(field: string) {
    this._filters.update((filters) =>
      filters.filter((filter) => filter.field !== field),
    );
  }

  /**
   * Adds multiple filters to the current filters.
   *
   * Iterates over the new filters and adds them to the current filters.
   * The new filters are added to the end of the current filters.
   *
   * @param newFilters An array of new filter objects to add to the current filters.
   */
  addFilters(newFilters: filter[]) {
    this._filters.update((filters) => [...filters, ...newFilters]);
  }

  /**
   * Removes multiple filters by field names.
   *
   * Iterates over the current filters and removes any filters
   * whose field matches any of the specified fields in the input array.
   *
   * @param fields An array of field names to identify which filters to remove.
   */

  removeFilters(fields: string[]) {
    this._filters.update((filters) =>
      filters.filter((filter) => !fields.includes(filter.field)),
    );
  }

  /**
   * Clear all filters.
   *
   * Resets the filters signal to an empty array.
   */
  clearFilters() {
    this._filters.update((filters) => []);
  }
  //#endregion

  /**
   * Takes a filter object and returns a mongoDB compatible filter object.
   * @example
   * buildFilterObject({ field: 'name', operator: '==', value: 'John Doe' })
   * returns { name: { $eq: 'John Doe' } }
   * @param filter The filter object to transform
   * @returns A mongoDB compatible filter object
   */
  private buildFilterObject(filter: filter) {
    let operator = '';
    let value = filter.value;

    switch (filter.operator) {
      case '==':
        operator = '$eq';
        break;
      case '!=':
        operator = '$ne';
        break;
      case '>':
        operator = '$gt';
        break;
      case '<':
        operator = '$lt';
        break;
      case '>=':
        operator = '$gte';
        break;
      case '<=':
        operator = '$lte';
        break;
      case 'in':
        operator = '$in';
        break;
      case 'not in':
        operator = '$nin';
        break;
      case 'like':
        operator = '$regex';
        value = `^${value}`;
        break;
      case 'not like':
        operator = '$notRegex';
        value = `^${value}`;
        break;
      default:
        operator = filter.operator || '$eq';
        break;
    }

    return {
      [filter.field]: {
        [operator]: value,
        $options: 'i',
      },
    };
  }

  /**
   * Builds a mongoDB compatible filter object using the current filters.
   * The built filter object will have the operator as the key and the value
   * will be an array of filter objects transformed to mongoDB compatible format.
   * @example
   * getFilterObject('$or')
   * returns { $or: [ { name: { $eq: 'John Doe' } }, { age: { $gt: 18 } } ] }
   * @param operator The operator to use for the mongoDB filter object.
   * @returns A mongoDB compatible filter object
   */
  getFilterObject(operator: filterOperator) {
    const filters = {
      ['$' + operator]: this.filters().map((filter) =>
        this.buildFilterObject(filter),
      ),
    };

    return filters;
  }
}
