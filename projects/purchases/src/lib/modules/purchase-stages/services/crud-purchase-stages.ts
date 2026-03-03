import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { purchaseStage } from '../interfaces/purchase-stage';

@Injectable({
  providedIn: 'root',
})
export class CrudPurchaseStages extends ApiRequestManager<purchaseStage> {
  constructor() {
    super();
    super.endpoint = 'purchase-stages';
  }
}
