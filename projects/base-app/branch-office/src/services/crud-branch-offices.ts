import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { branchOffice } from '../interfaces/branch-office';

@Injectable({
  providedIn: 'root',
})
export class CrudBranchOffices extends ApiRequestManager<branchOffice> {
  constructor() {
    super();
    super.endpoint = 'branch-offices';
  }
}
