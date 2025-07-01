import { company } from './../interfaces/company';
import { Injectable } from '@angular/core';
import { ApiRequestManager } from '../../../../common';

@Injectable({
  providedIn: 'root',
})
export class CrudCompanies extends ApiRequestManager {
  constructor() {
    super();
  }

  getCompanies(): company[] {
    return [
      {
        _id: 'abc',
        name: 'ACB Company',
      },
      {
        _id: 'cde',
        name: 'CDE Company',
      },
      {
        _id: '123',
        name: 'Avalantec Company',
      },
    ];
  }
}
