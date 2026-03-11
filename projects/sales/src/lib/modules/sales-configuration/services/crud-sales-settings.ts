import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { salesSettings } from '../interfaces/sales-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudSalesSettings extends ApiRequestManager<salesSettings> {
  constructor() {
    super();
    super.endpoint = 'sales/settings';
  }

  getSettings() {
    return rxResource<salesSettings, void>({
      stream: () =>
        this._httpClient.get<salesSettings>(`${this._apiURL}/${this.endpoint}`).pipe(
          catchError(() => of({} as salesSettings))
        ),
    });
  }

  putSettings(data: Record<string, any>): Observable<salesSettings | undefined> {
    return this._httpClient.put<salesSettings>(
      `${this._apiURL}/${this.endpoint}`,
      data
    );
  }
}
