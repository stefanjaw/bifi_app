import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { bugReporting } from '../interfaces/bug-reporting';

@Injectable({
  providedIn: 'root',
})
export class CrudBugReporting extends ApiRequestManager<bugReporting> {
  constructor() {
    super();
    super.endpoint = 'bug-report';
  }
}
