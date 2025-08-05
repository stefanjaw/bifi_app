import { Injectable } from '@angular/core';
import { user } from '../interfaces/user';
import { BaseCrudUsers } from '@avalantec/base-app/settings';

@Injectable({
  providedIn: 'root',
})
export class CrudUsers extends BaseCrudUsers<user> {}
