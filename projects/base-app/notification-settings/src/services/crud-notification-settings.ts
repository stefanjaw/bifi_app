import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { NotificationSettings, NotificationCatalogEntry } from '../interfaces/notification-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudNotificationSettings extends ApiRequestManager<NotificationSettings> {
  constructor() {
    super();
    super.endpoint = 'notification-settings';
  }

  getSettings() {
    return rxResource<NotificationSettings, void>({
      stream: () =>
        this._httpClient
          .get<NotificationSettings>(`${this._apiURL}/${this.endpoint}`)
          .pipe(catchError(() => of({ events: [] } as NotificationSettings))),
    });
  }

  getCatalog() {
    return rxResource<NotificationCatalogEntry[], void>({
      stream: () =>
        this._httpClient
          .get<NotificationCatalogEntry[]>(`${this._apiURL}/${this.endpoint}/catalog`)
          .pipe(catchError(() => of([] as NotificationCatalogEntry[]))),
    });
  }

  putSettings(data: NotificationSettings): Observable<NotificationSettings | undefined> {
    return this._httpClient.put<NotificationSettings>(
      `${this._apiURL}/${this.endpoint}`,
      data
    );
  }
}
