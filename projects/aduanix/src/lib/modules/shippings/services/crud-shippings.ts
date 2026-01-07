import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { invoicePDF, shipping } from '../interfaces/shipping';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudShippings extends ApiRequestManager<shipping> {
  constructor() {
    super();
    super.endpoint = 'shippings';
  }

  /**
   * Generates HS codes for shipping lines using the GEN-AI service.
   *
   * This function takes an array of shipping lines as input and returns an observable
   * that resolves to an array of the same lines with their HS codes generated.
   *
   * @param lines - The shipping lines to generate HS codes for.
   * @returns An observable that resolves to an array of the same lines with their HS codes generated.
   */
  generateHSCodesForShipping(
    lines: invoicePDF['extractedData']['lines']
  ): Observable<invoicePDF['extractedData']['lines'] | undefined> {
    return this.post({
      data: { lines },
      specificEndpoint: `hs-code/generate`,
    }) as any;
  }
}
