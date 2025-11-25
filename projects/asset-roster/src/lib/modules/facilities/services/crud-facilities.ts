import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { facility } from '../interfaces/facility';

@Injectable({
  providedIn: 'root',
})
export class CrudFacilities extends ApiRequestManager<facility> {
  constructor() {
    super();
    super.endpoint = 'facilities';
  }
}
