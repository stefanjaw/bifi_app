import { Injectable } from '@angular/core';
import { user } from '@avalantec/base-app/core';
import { BaseCrudUsers } from './base-crud-users';

@Injectable({
  providedIn: 'root',
})
export class CrudUsers extends BaseCrudUsers<user> {}
