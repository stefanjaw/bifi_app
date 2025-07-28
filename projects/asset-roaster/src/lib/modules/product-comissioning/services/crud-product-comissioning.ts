import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { productComissionnig } from '../interfaces/product-comissioning';

@Injectable({
  providedIn: 'root',
})
export class CrudProductComissioning extends ApiRequestManager<productComissionnig> {
  constructor() {
    super();
    super.endpoint = 'product-comissioning';
  }
}
