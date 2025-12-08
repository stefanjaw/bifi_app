import { Injectable } from '@angular/core';
import { BASE_APP_ROUTES } from '../routing/base-app.routes';
import { BaseRoutingManager } from '../libraries/base-routing-manager';

@Injectable({
  providedIn: 'root',
})
export class MainRoutingManager extends BaseRoutingManager {
  constructor() {
    super(BASE_APP_ROUTES);
  }
}
