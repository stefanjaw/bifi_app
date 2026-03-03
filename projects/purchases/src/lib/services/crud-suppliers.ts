import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { supplier } from '../interfaces/supplier';

@Injectable({
  providedIn: 'root',
})
export class CrudSuppliers extends ApiRequestManager<supplier> {
  constructor() {
    super();
    super.endpoint = 'purchases/suppliers';
  }
}
