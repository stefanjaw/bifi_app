import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import {
  pricingSettings,
  IndexingStatus,
  IndexingSummary,
} from '../interfaces/pricing-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudPricingSettings extends ApiRequestManager<pricingSettings> {
  constructor() {
    super();
    super.endpoint = 'pricing-settings';
  }

  getSettings() {
    return rxResource<pricingSettings, void>({
      stream: () =>
        this._httpClient
          .get<pricingSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as pricingSettings))),
    });
  }

  putSettings(data: Record<string, unknown>): Observable<pricingSettings | undefined> {
    return this._httpClient.put<pricingSettings>(
      `${this._apiURL}/${this.endpoint}`,
      data
    );
  }

  triggerIndexing(type?: 'pricing' | 'freight' | 'all', force?: boolean): Observable<IndexingSummary> {
    return this._httpClient.post<IndexingSummary>(
      `${this._apiURL}/pricing-index/trigger`,
      { type: type || 'all', ...(force ? { force: true } : {}) }
    );
  }

  getIndexingStatus(): Observable<IndexingStatus> {
    return this._httpClient.get<IndexingStatus>(
      `${this._apiURL}/pricing-index/status`
    );
  }
}
