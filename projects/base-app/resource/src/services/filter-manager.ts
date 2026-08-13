import { Injectable, signal } from '@angular/core';
import { filter, filterGroup } from '../interfaces/filter';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class FilterManager {
  protected _filters = signal<filterGroup[]>([]);

  get filters() {
    return this._filters.asReadonly();
  }

  //#region Filter managament

  /**
   * Adds a new filter group to the current set of filters.
   *
   * Updates the filters signal to include the provided filter group.
   *
   * @param newFilter The filter group to add.
   */

  addFilter(newFilter: filterGroup<any>) {
    this._filters.update(filters => [...filters, newFilter]);
  }

  /**
   * Removes a filter by its ID.
   *
   * Updates the filters signal to exclude the filter with the specified ID.
   *
   * @param id The ID of the filter to remove.
   */

  removeFilter(id: string) {
    this._filters.update(filters => filters.filter(filter => filter.id !== id));
  }

  /**
   * Adds multiple filters at once.
   *
   * Updates the filters signal to add all filters in the given array.
   *
   * @param newFilters The filters to add.
   */
  addFilters(newFilters: filterGroup<any>[]) {
    this._filters.update(filters => [...filters, ...newFilters]);
  }

  /**
   * Removes multiple filters at once.
   *
   * Updates the filters signal to remove all filters with IDs in the given array.
   *
   * @param ids The IDs of the filters to remove.
   */
  removeFilters(ids: string[]) {
    this._filters.update(filters => filters.filter(filter => !ids.includes(filter?.id || '')));
  }

  /**
   * Clear all filters.
   *
   * Resets the filters signal to an empty array.
   */
  clearFilters() {
    this._filters.set([]);
  }
  //#endregion

  /**
   * Converts a filter object into a MongoDB compatible query object.
   *
   * This function takes a filter object containing a field, operator, and value,
   * and maps the operator to its MongoDB equivalent. For certain operators like
   * 'like' and 'not like', additional processing is done to transform the value
   * into a regex pattern with case-insensitive options. The function returns an
   * object where the field is the key, and the value is an object with the MongoDB
   * operator and corresponding value.
   *
   * @param filter - The filter object containing the field, operator, and value.
   * @returns An object with the field as the key and a MongoDB query object as the value.
   */

  private buildFilterObject(filter: filter<any>) {
    let operator = '';
    let value = filter.value;

    // Date filters expand the picked calendar day into a full local-day UTC
    // range so that strict equality ("On") and the inclusive boundary operators
    // ("Before or on" / "After or on") match records whose stored datetime falls
    // anywhere within that day. dayjs parses the YYYY-MM-DD value in the
    // browser's local timezone, so the range honors the user's local day.
    if (filter.type === 'date' && value != null && value !== '') {
      const dayStart = dayjs(String(value)).startOf('day');
      const nextDayStart = dayjs(String(value)).add(1, 'day').startOf('day');
      const startIso = dayStart.toISOString();
      const nextDayIso = nextDayStart.toISOString();

      switch (filter.operator) {
        case '==':
          return { [filter.field]: { $gte: startIso, $lt: nextDayIso } };
        case '!=':
          return { [filter.field]: { $not: { $gte: startIso, $lt: nextDayIso } } };
        case '>':
          return { [filter.field]: { $gte: nextDayIso } };
        case '<':
          return { [filter.field]: { $lt: startIso } };
        case '>=':
          return { [filter.field]: { $gte: startIso } };
        case '<=':
          return { [filter.field]: { $lt: nextDayIso } };
      }
    }

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
        value = this.normalizeForFlexibleSearch(value?.toString() || '');
        break;
      case 'not like':
        return {
          [filter.field]: {
            $not: {
              $regex: this.normalizeForFlexibleSearch(value?.toString() || ''),
              $options: 'i',
            },
          },
        };
      case 'empty':
        operator = '$size';
        value = 0;
        break;
      default:
        operator = filter.operator || '$eq';
        break;
    }

    return {
      [filter.field]: {
        [operator]: value,
        ...(filter.operator === 'like' && {
          $options: 'i',
        }),
      },
    };
  }

  /**
   * Builds a MongoDB query object from the current set of filters.
   *
   * Iterates over the filters signal and applies the buildFilterObject function
   * to each filter. The results are aggregated into a single object where the
   * field is the key, and the value is an object with the MongoDB operator and
   * corresponding value. The operator is included in the key as a prefix, e.g.
   * '$eq', '$gt', etc.
   *
   * @returns A MongoDB query object representing the current set of filters.
   */
  getFilterObject() {
    return this.getFilterObjectUtil(this._filters());
  }

  /**
   * A utility function to convert a filterGroup array into a MongoDB query object.
   *
   * This function takes an array of filterGroups and applies the buildFilterObject
   * function to each filter in the group. The results are aggregated into a single
   * object where the field is the key, and the value is an object with the MongoDB
   * operator and corresponding value.
   *
   * @param filters The array of filterGroups to convert.
   * @returns A MongoDB query object representing the given filterGroups.
   */
  getFilterObjectUtil(filters: filterGroup<Record<string, any>>[]) {
    const arrayFilters = filters.map(filter => ({
      ['$' + filter.operator]: filter.filters.map(filter =>
        this.isFilterGroup(filter)
          ? this.getFilterObjectUtil([filter])
          : this.buildFilterObject(filter)
      ),
    }));

    let parsedFilters = {};

    arrayFilters.forEach(
      filter =>
        (parsedFilters = {
          ...parsedFilters,
          ...filter,
        })
    );

    return parsedFilters;
  }

  /**
   * Checks if an object or any of its nested objects contain the 'active' property.
   * @param obj The object to check
   * @returns {boolean} True if the object or any of its nested objects contain the 'active' property, false otherwise.
   */
  hasActivePropertyUtil(obj: any): boolean {
    if (obj == null || typeof obj !== 'object') return false;

    if ('active' in obj) return true;

    for (const key of Object.keys(obj)) {
      if (this.hasActivePropertyUtil(obj[key])) return true;
    }

    return false;
  }

  /**
   * Type guard to check if a given filter is a filterGroup.
   *
   * A filterGroup is an object with a 'filters' property, so this function
   * simply checks for the existence of that property.
   *
   * @param filter The object to check.
   * @returns True if the object is a filterGroup, false otherwise.
   */
  private isFilterGroup(
    filter: filter<Record<string, any>> | filterGroup<any>
  ): filter is filterGroup<Record<string, any>> {
    return 'filters' in filter;
  }

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private normalizeForFlexibleSearch(value: string): string {
    value = value.trim().replace(/\s+/g, ' ');
    const parts = value.split(' ').map(v => this.escapeRegex(v));
    return parts.join(' ');
  }
}
