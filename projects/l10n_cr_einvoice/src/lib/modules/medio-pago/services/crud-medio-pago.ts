import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';

export interface medioPago {
  _id: string;
  code: string;
  description: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class CrudMedioPago extends ApiRequestManager<medioPago> {
  constructor() {
    super();
    super.endpoint = 'cr-einvoice/medio-pago';
  }
}
