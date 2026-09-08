import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { valuationQuery, valuationReport } from '../interfaces/inventory-valuation';

@Injectable({
  providedIn: 'root',
})
export class CrudInventoryValuation extends ApiRequestManager<valuationReport> {
  constructor() {
    super();
    super.endpoint = 'inventory/valuation';
  }

  /**
   * Returns a reactive resource for the inventory valuation report matching the given query getter.
   * The getter reads reactive state (signals), so the resource re-evaluates automatically
   * whenever the query parameters change.
   * @param query - A getter returning the valuation query (mode, dates, and optional filters).
   * @returns A reactive resource with the valuation report.
   */
  getValuation(query: () => valuationQuery) {
    return rxResource<valuationReport, valuationQuery>({
      params: query,
      stream: ({ params }) => {
        let httpParams = new HttpParams().set('mode', params.mode);
        if (params.asOfDate) httpParams = httpParams.set('asOfDate', params.asOfDate);
        if (params.fromDate) httpParams = httpParams.set('fromDate', params.fromDate);
        if (params.toDate) httpParams = httpParams.set('toDate', params.toDate);
        if (params.warehouseId) httpParams = httpParams.set('warehouseId', params.warehouseId);
        if (params.locationId) httpParams = httpParams.set('locationId', params.locationId);
        if (params.productId) httpParams = httpParams.set('productId', params.productId);
        if (params.productTypeId)
          httpParams = httpParams.set('productTypeId', params.productTypeId);
        return this._httpClient.get<valuationReport>(`${this._apiURL}/${this.endpoint}`, {
          params: httpParams,
        });
      },
    });
  }
}
