import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { productComissionning } from '../interfaces/product-comissioning';

@Injectable({
  providedIn: 'root',
})
export class CrudProductComissioning extends ApiRequestManager<productComissionning> {
  constructor() {
    super();
    super.endpoint = 'product-comissioning';
  }
}
