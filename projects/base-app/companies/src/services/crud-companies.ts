import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { company } from '@avalantec/base-app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CrudCompanies extends ApiRequestManager<company> {
  constructor() {
    super();
    super.endpoint = 'companies';
  }
}
