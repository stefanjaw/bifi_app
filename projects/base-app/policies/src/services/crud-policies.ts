import { Injectable } from '@angular/core';
import { policy } from '@avalantec/base-app/interfaces';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudPolicies extends ApiRequestManager<policy<string, string>> {
  constructor() {
    super();
    this.endpoint = 'policies';
  }
}
