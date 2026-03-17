import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { customsTariff } from '../interfaces/customs-tariff';

@Injectable({
  providedIn: 'root',
})
export class CrudCustomsTariffs extends ApiRequestManager<customsTariff> {
  constructor() {
    super();
    super.endpoint = 'customs-tariffs';
  }
}
