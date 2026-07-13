import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { InventoryDashboardData } from '../interfaces/inventory-dashboard';

@Injectable({
  providedIn: 'root',
})
export class CrudInventoryDashboard extends ApiRequestManager<InventoryDashboardData> {
  constructor() {
    super();
    super.endpoint = 'inventory';
  }
}
