import { Injectable } from '@angular/core';
import { role } from '@avalantec/base-app/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudRoles extends ApiRequestManager<role> {
  constructor() {
    super({
      endpoint: 'roles',
      elementName: 'role',
      config: {},
    });
  }
}
