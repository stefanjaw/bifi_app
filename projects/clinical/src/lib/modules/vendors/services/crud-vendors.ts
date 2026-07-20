import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { vendor } from '../interfaces/vendors';

/** CRUD service for managing vendors */
@Injectable({ providedIn: 'root' })
export class CrudVendors extends ApiRequestManager<vendor> {
  constructor() {
    super();
    this.endpoint = 'vendors';
  }
}
