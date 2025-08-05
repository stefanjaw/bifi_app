import { Injectable } from '@angular/core';
import { BaseCrudUsers } from '@avalantec/base-app/settings';
import { user } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class CrudUsers extends BaseCrudUsers<user> {}
