import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { PurchasesDashboardData } from '../interfaces/purchases-dashboard';

@Injectable({
  providedIn: 'root',
})
export class CrudPurchasesDashboard extends ApiRequestManager<PurchasesDashboardData> {
  constructor() {
    super();
    super.endpoint = 'purchases';
  }
}
