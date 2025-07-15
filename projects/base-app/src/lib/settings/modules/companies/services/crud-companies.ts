import { company } from './../interfaces/company';
import { Injectable } from '@angular/core';
import { ApiRequestManager } from '../../../../system';

@Injectable({
  providedIn: 'root',
})
export class CrudCompanies extends ApiRequestManager<company> {
  constructor() {
    super();
    super.endpoint = 'companies';
  }
}
