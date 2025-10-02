import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { country } from '../interfaces/country';

@Injectable({
  providedIn: 'root',
})
export class CrudCountries extends ApiRequestManager<country> {
  constructor() {
    super();
    super.endpoint = 'countries';
  }
}
