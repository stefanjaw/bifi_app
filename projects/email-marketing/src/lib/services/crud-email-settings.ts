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

  /** Returns a reactive resource ref that fetches email provider settings */
  getSettings() {
    return rxResource<emailSettings, void>({
      stream: () =>
        this._httpClient
          .get<emailSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as emailSettings))),
    });
  }

  /**
   * Saves updated email provider settings to the server
   * @param data - The email settings data to save
   * @returns Observable of the saved email settings
   */
  putSettings(data: Record<string, any>): Observable<emailSettings | undefined> {
    return this._httpClient.put<emailSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }

  /**
   * Tests the email provider connection with the current settings
   * @returns Observable with ok status and message
   */
  testConnection(): Observable<{ ok: boolean; message: string }> {
    return this._httpClient.post<{ ok: boolean; message: string }>(
      `${this._apiURL}/${this.endpoint}/test-connection`,
      {}
    );
  }
}
