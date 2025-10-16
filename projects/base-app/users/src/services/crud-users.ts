import { Injectable } from '@angular/core';
import { BaseCrudUsers } from './base-crud-users';
import { user } from '@avalantec/base-app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CrudUsers extends BaseCrudUsers<user> {}
