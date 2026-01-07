import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { shipping } from '../interfaces/shipping';

@Injectable({
  providedIn: 'root',
})
export class CrudShippings extends ApiRequestManager<shipping> {
  constructor() {
    super();
    super.endpoint = 'shippings';
  }

  generateHSCodesForShipping(id: string) {
    return this.put({
      _id: id,
      data: {},
      specificEndpoint: `hs-code/generate/${id}`,
    });
  }
}
