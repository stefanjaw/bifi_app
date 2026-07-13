import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { inventorySettings } from '../interfaces/inventory-settings';

@Injectable({
  providedIn: 'root',
})
export class CrudInventorySettings extends ApiRequestManager<inventorySettings> {
  constructor() {
    super();
    super.endpoint = 'inventory/settings';
  }

  getSettings() {
    return rxResource<inventorySettings, void>({
      stream: () => this._httpClient.get<inventorySettings>(`${this._apiURL}/${this.endpoint}`),
    });
  }

  putSettings(data: Record<string, any>): Observable<inventorySettings | undefined> {
    return this._httpClient.put<inventorySettings>(`${this._apiURL}/${this.endpoint}`, data);
  }
}
