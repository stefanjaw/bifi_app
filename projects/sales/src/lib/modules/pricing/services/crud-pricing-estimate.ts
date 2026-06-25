import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Observable } from 'rxjs';
import { pricingEstimate, tokenEstimation } from '../interfaces/pricing-estimate';

@Injectable({
  providedIn: 'root',
})
export class CrudPricingEstimate extends ApiRequestManager<pricingEstimate> {
  constructor() {
    super();
    super.endpoint = 'pricing-estimates';
  }

  generate(data: Record<string, unknown>): Observable<pricingEstimate> {
    return this._httpClient.post<pricingEstimate>(
      `${this._apiURL}/${this.endpoint}/generate`,
      data
    );
  }

  tokenEstimate(requestText: string): Observable<tokenEstimation> {
    return this._httpClient.post<tokenEstimation>(
      `${this._apiURL}/${this.endpoint}/token-estimate`,
      { requestText }
    );
  }

  getHistory(params?: { page?: number; limit?: number; search?: string }): Observable<unknown> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams['page'] = String(params.page);
    if (params?.limit) queryParams['limit'] = String(params.limit);
    if (params?.search) queryParams['search'] = params.search;
    return this._httpClient.get(`${this._apiURL}/${this.endpoint}`, { params: queryParams });
  }

  getById(id: string): Observable<pricingEstimate> {
    return this._httpClient.get<pricingEstimate>(`${this._apiURL}/${this.endpoint}/${id}`);
  }

  getPdf(id: string): Observable<Blob> {
    return this._httpClient.get(`${this._apiURL}/${this.endpoint}/${id}/pdf`, {
      responseType: 'blob',
    });
  }

  getCsv(id: string): Observable<Blob> {
    return this._httpClient.get(`${this._apiURL}/${this.endpoint}/${id}/csv`, {
      responseType: 'blob',
    });
  }
}
