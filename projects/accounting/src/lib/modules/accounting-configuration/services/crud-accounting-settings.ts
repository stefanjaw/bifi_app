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

  getSettings() {
    return rxResource<accountingSettings, void>({
      stream: () =>
        this._httpClient
          .get<accountingSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as accountingSettings))),
    });
  }

  putSettings(data: Record<string, any>): Observable<accountingSettings | undefined> {
    return this._httpClient.put<accountingSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }
}
