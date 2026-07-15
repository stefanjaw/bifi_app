import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { product } from '../interfaces/product';

export interface productStockSummary {
  onHand: number;
  incoming: number;
  committed: number;
  available: number;
}

@Injectable({
  providedIn: 'root',
})
export class CrudProducts extends ApiRequestManager<product> {
  constructor() {
    super();
    super.endpoint = 'inventory/products';
  }

  /**
   * Fetches stock summary figures for a given product
   * @param id - The product ID
   * @returns Observable of the stock summary
   */
  getStockSummary(id: string): Observable<productStockSummary> {
    return this._httpClient.get<productStockSummary>(
      `${this._apiURL}/${this.endpoint}/${id}/stock-summary`
    );
  }
}
