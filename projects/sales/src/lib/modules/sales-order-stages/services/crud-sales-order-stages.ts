import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { salesOrderStage } from '../interfaces/sales-order-stage';

@Injectable({
  providedIn: 'root',
})
export class CrudSalesOrderStages extends ApiRequestManager<salesOrderStage> {
  constructor() {
    super();
    super.endpoint = 'sales-order-stages';
  }
}
