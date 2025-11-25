import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { maintenanceWindow } from '../interfaces/maintenance-window';

@Injectable({
  providedIn: 'root',
})
export class CrudMaintenanceWindows extends ApiRequestManager<maintenanceWindow> {
  constructor() {
    super();
    super.endpoint = 'maintenance-windows';
  }
}
