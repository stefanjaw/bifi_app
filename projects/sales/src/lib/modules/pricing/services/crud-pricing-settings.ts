import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { pricingSettings, IndexingStatus, IndexingSummary } from '../interfaces/pricing-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudPricingSettings extends ApiRequestManager<pricingSettings> {
  constructor() {
    super();
    super.endpoint = 'pricing-settings';
  }

  /** Returns a reactive resource ref that fetches pricing settings */
  getSettings() {
    return rxResource<pricingSettings, void>({
      stream: () =>
        this._httpClient
          .get<pricingSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as pricingSettings))),
    });
  }

  /**
   * Saves updated pricing settings to the server
   * @param data - The pricing settings data to save
   * @returns Observable of the saved pricing settings
   */
  putSettings(data: Record<string, unknown>): Observable<pricingSettings | undefined> {
    return this._httpClient.put<pricingSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }

  /**
   * Triggers a pricing index rebuild, optionally limiting to a specific type and forcing a full refresh
   * @param type - Optional index type to limit the rebuild to (pricing, freight, or all)
   * @param force - Whether to force a full refresh regardless of cache state
   * @returns Observable of the indexing summary result
   */
  triggerIndexing(
    type?: 'pricing' | 'freight' | 'all',
    force?: boolean
  ): Observable<IndexingSummary> {
    return this._httpClient.post<IndexingSummary>(`${this._apiURL}/pricing-index/trigger`, {
      type: type || 'all',
      ...(force ? { force: true } : {}),
    });
  }

  /**
   * Returns the current status of pricing index synchronization
   * @returns Observable of the current indexing status
   */
  getIndexingStatus(): Observable<IndexingStatus> {
    return this._httpClient.get<IndexingStatus>(`${this._apiURL}/pricing-index/status`);
  }
}
