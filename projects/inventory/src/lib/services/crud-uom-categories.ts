import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { uomCategory } from '../interfaces/uom-category';

@Injectable({
  providedIn: 'root',
})
export class CrudUomCategories extends ApiRequestManager<uomCategory> {
  constructor() {
    super();
    super.endpoint = 'inventory/uom-categories';
  }
}
