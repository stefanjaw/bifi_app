import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { customsHeading } from '../interfaces/customs-heading';

@Injectable({
  providedIn: 'root',
})
export class CrudCustomsHeadings extends ApiRequestManager<customsHeading> {
  constructor() {
    super();
    super.endpoint = 'customs-headings';
  }
}
