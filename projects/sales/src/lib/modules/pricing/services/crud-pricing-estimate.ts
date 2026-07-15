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

  /**
   * Generates a new pricing estimate from the provided request data
   * @param data - The request payload for generating the estimate
   * @returns Observable of the generated pricing estimate
   */
  generate(data: Record<string, unknown>): Observable<pricingEstimate> {
    return this._httpClient.post<pricingEstimate>(
      `${this._apiURL}/${this.endpoint}/generate`,
      data
    );
  }

  /**
   * Estimates the token count for a given text request
   * @param requestText - The text to estimate tokens for
   * @returns Observable of the token estimation result
   */
  tokenEstimate(requestText: string): Observable<tokenEstimation> {
    return this._httpClient.post<tokenEstimation>(
      `${this._apiURL}/${this.endpoint}/token-estimate`,
      { requestText }
    );
  }

  /**
   * Retrieves paginated pricing estimate history
   * @param params - Optional pagination and search parameters
   * @returns Observable of the paginated history results
   */
  getHistory(params?: { page?: number; limit?: number; search?: string }): Observable<unknown> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams['page'] = String(params.page);
    if (params?.limit) queryParams['limit'] = String(params.limit);
    if (params?.search) queryParams['search'] = params.search;
    return this._httpClient.get(`${this._apiURL}/${this.endpoint}`, { params: queryParams });
  }

  /**
   * Fetches a single pricing estimate by its id
   * @param id - The pricing estimate id
   * @returns Observable of the pricing estimate
   */
  getById(id: string): Observable<pricingEstimate> {
    return this._httpClient.get<pricingEstimate>(`${this._apiURL}/${this.endpoint}/${id}`);
  }

  /**
   * Downloads the pricing estimate as a PDF blob
   * @param id - The pricing estimate id
   * @returns Observable of the PDF blob
   */
  getPdf(id: string): Observable<Blob> {
    return this._httpClient.get(`${this._apiURL}/${this.endpoint}/${id}/pdf`, {
      responseType: 'blob',
    });
  }

  /**
   * Downloads the pricing estimate as a CSV blob
   * @param id - The pricing estimate id
   * @returns Observable of the CSV blob
   */
  getCsv(id: string): Observable<Blob> {
    return this._httpClient.get(`${this._apiURL}/${this.endpoint}/${id}/csv`, {
      responseType: 'blob',
    });
  }
}
