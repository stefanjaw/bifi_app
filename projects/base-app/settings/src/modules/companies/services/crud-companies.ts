import { ApiRequestManager } from '@avalantec/base-app/resource';
import { company } from '../interfaces/company';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CrudCompanies extends ApiRequestManager<company> {
  constructor() {
    super();
    super.endpoint = 'companies';
  }
}
