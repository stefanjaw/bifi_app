import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';

export interface condicionVenta {
  _id: string;
  code: string;
  description: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class CrudCondicionVenta extends ApiRequestManager<condicionVenta> {
  constructor() {
    super();
    super.endpoint = 'cr-einvoice/condicion-venta';
  }
}
