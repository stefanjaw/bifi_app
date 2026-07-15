import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { driveSettings } from '../interfaces/drive-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudDriveSettings extends ApiRequestManager<driveSettings> {
  constructor() {
    super();
    super.endpoint = 'drive-settings';
  }

  getSettings() {
    return rxResource<driveSettings, void>({
      stream: () =>
        this._httpClient
          .get<driveSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({} as driveSettings))),
    });
  }

  putSettings(data: Record<string, unknown>): Observable<driveSettings | undefined> {
    return this._httpClient.put<driveSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }
}
