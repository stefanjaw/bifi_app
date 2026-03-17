import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { aiSettings } from '../interfaces/ai-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudAiSettings extends ApiRequestManager<aiSettings> {
  constructor() {
    super();
    super.endpoint = 'ai-settings';
  }

  getSettings() {
    return rxResource<aiSettings, void>({
      stream: () =>
        this._httpClient
          .get<aiSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as aiSettings))),
    });
  }

  putSettings(data: Record<string, unknown>): Observable<aiSettings | undefined> {
    return this._httpClient.put<aiSettings>(
      `${this._apiURL}/${this.endpoint}`,
      data
    );
  }
}
