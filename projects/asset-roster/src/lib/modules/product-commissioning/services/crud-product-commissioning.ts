import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { productCommissionning } from '../interfaces/product-commissioning';

@Injectable({
  providedIn: 'root',
})
export class CrudProductCommissioning extends ApiRequestManager<productCommissionning> {
  constructor() {
    super();
    super.endpoint = 'product-commissioning';
  }
}
