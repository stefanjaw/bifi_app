import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { searchDestination, searchDestinationSyncResult } from '../interfaces/search-destination';

@Injectable({
  providedIn: 'root',
})
export class CrudSearchDestinations extends ApiRequestManager<searchDestination> {
  constructor() {
    super();
    super.endpoint = 'search-destinations';
  }

  /**
   * Imperative fetch of every destination (active AND inactive). Used by the
   * "Sync from menu" merge so it can match against existing rows by route and
   * never create duplicates or clobber deactivated rows.
   */
  getAllDestinations(): Observable<searchDestination[]> {
    const url = this.formatFullURL();
    const params = new HttpParams({
      fromString: new URLSearchParams({
        searchParams: JSON.stringify({}),
      }).toString(),
    });
    return this._httpClient.get<searchDestination[]>(url, { params });
  }

  /**
   * Reconcile a provided list of destinations into the backend collection.
   * Sent as JSON (NOT FormData) so the array survives transport and the
   * backend's `Array.isArray` guard passes.
   */
  sync(destinations: Record<string, any>[]): Observable<searchDestinationSyncResult> {
    const url = `${this.formatFullURL()}/sync`;
    return this._httpClient.post<searchDestinationSyncResult>(url, {
      destinations,
    });
  }
}
