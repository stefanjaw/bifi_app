import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { location } from '../interfaces/location';

@Injectable({
  providedIn: 'root',
})
export class CrudLocations extends ApiRequestManager<location> {
  constructor() {
    super();
    super.endpoint = 'inventory/locations';
  }
}
