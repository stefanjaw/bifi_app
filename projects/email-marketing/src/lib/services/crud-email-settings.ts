import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { emailSettings } from '../interfaces/email-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudEmailSettings extends ApiRequestManager<emailSettings> {
  constructor() {
    super();
    super.endpoint = 'email-settings';
  }

  getSettings() {
    return rxResource<emailSettings, void>({
      stream: () =>
        this._httpClient
          .get<emailSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as emailSettings))),
    });
  }

  putSettings(data: Record<string, any>): Observable<emailSettings | undefined> {
    return this._httpClient.put<emailSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }

  testConnection(): Observable<{ ok: boolean; message: string }> {
    return this._httpClient.post<{ ok: boolean; message: string }>(
      `${this._apiURL}/${this.endpoint}/test-connection`,
      {}
    );
  }
}
