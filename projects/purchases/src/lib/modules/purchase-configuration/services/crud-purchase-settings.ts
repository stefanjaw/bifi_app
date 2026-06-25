import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { purchaseSettings } from '../interfaces/purchase-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudPurchaseSettings extends ApiRequestManager<purchaseSettings> {
  constructor() {
    super();
    super.endpoint = 'purchases/settings';
  }

  getSettings() {
    return rxResource<purchaseSettings, void>({
      stream: () => this._httpClient.get<purchaseSettings>(`${this._apiURL}/${this.endpoint}`),
    });
  }

  putSettings(data: Record<string, any>): Observable<purchaseSettings | undefined> {
    return this._httpClient.put<purchaseSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }
}
