import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { accountingSettings } from '../interfaces/accounting-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudAccountingSettings extends ApiRequestManager<accountingSettings> {
  constructor() {
    super();
    super.endpoint = 'accounting/settings';
  }

  /** Returns a reactive resource ref that fetches the accounting settings */
  getSettings() {
    return rxResource<accountingSettings, void>({
      stream: () =>
        this._httpClient
          .get<accountingSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as accountingSettings))),
    });
  }

  /**
   * Saves updated accounting settings to the server
   * @param data - Updated accounting settings
   * @returns Observable of the updated accounting settings
   */
  putSettings(data: Record<string, any>): Observable<accountingSettings | undefined> {
    return this._httpClient.put<accountingSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }
}
