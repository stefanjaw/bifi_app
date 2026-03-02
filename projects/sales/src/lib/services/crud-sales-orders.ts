import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { salesOrder } from '../interfaces/sales-order';

@Injectable({
  providedIn: 'root',
})
export class CrudSalesOrders extends ApiRequestManager<salesOrder> {
  constructor() {
    super();
    super.endpoint = 'sales-orders';
  }
}
