import { Injectable } from '@angular/core';
import { role } from '@avalantec/base-app/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudRoles extends ApiRequestManager<role> {
  constructor() {
    super({
      config: {
        create: {
          notificationConfig: {
            loadingMessage: 'Creating role...',
            successMessage: 'Role created successfully.',
            errorMessage: 'Error creating role. {{ message }}',
          },
        },
        update: {
          notificationConfig: {
            loadingMessage: 'Updating role...',
            successMessage: 'Role updated successfully.',
            errorMessage: 'Error updating role. {{ message }}',
          },
        },
        delete: {
          notificationConfig: {
            loadingMessage: 'Deleting role...',
            successMessage: 'Role deleted successfully.',
            errorMessage: 'Error deleting role. {{ message }}',
          },
        },
      },
      endpoint: 'roles',
    });
  }
}
