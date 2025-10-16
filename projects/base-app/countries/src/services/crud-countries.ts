import { Injectable } from '@angular/core';
import { country } from '@avalantec/base-app/interfaces';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudCountries extends ApiRequestManager<country> {
  constructor() {
    super();
    super.endpoint = 'countries';
  }
}
