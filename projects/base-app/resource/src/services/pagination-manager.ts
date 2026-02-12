import { Injectable, signal } from '@angular/core';
import { paginationOptions } from '../interfaces/pagination-options';

@Injectable({
  providedIn: 'root',
})
export class PaginationManager {
  readonly PIVOT = 5;

  private _paginationOptions = signal<paginationOptions>({
    page: 1,
    limit: this.PIVOT,
    paginate: true,
  });

  get paginationOptions() {
    return this._paginationOptions.asReadonly();
  }

  /**
   * Set the pagination options
   *
   * @param page The page number
   * @param limit The number of items per page
   */
  setPaginationOptions(page: number, limit: number) {
    this._paginationOptions.set({
      page,
      limit,
      paginate: true,
    });
  }

  /**
   * Reset the pagination options to their default values.
   *
   * This method will reset the pagination options to page 1 with a limit of 5 items per page.
   * This is useful when you need to reset the pagination options after a data change.
   */
  resetPaginationOptions() {
    this._paginationOptions.set({
      page: 1,
      limit: this.PIVOT,
      paginate: true,
    });
  }
}
