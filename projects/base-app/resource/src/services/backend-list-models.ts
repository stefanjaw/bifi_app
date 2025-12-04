import { Injectable } from '@angular/core';
import { ApiRequestManager } from './api-request-manager';

@Injectable({
  providedIn: 'root',
})
export class BackendListModels {
  private apiRequestManager = new ApiRequestManager<string>({
    endpoint: 'models',
    elementName: 'element',
    config: {},
  });

  getModelsList() {
    return this.apiRequestManager.get({ getInactive: null });
  }
}
