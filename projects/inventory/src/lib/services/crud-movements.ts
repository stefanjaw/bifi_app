import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { stockMovement } from '../interfaces/stock-movement';

@Injectable({
  providedIn: 'root',
})
export class CrudMovements extends ApiRequestManager<stockMovement> {
  constructor() {
    super();
    super.endpoint = 'inventory/movements';
  }

  override get(params: any = {}): any {
    return super.get({ ...params, getInactive: null });
  }

  override getWithPagination(params: any = {}): any {
    return super.getWithPagination({ ...params, getInactive: null });
  }

  /**
   * Reverses a posted stock movement, creating an opposing movement linked via reversalOf.
   * @param id - The ID of the movement to reverse.
   * @param data - Optional reversal data (custom note).
   * @returns Observable with the original and the reversal movement documents.
   */
  reverse(
    id: string,
    data: { notes?: string } = {}
  ): Observable<{ originalMovement: stockMovement; reversalMovement: stockMovement }> {
    return this._httpClient.post<{
      originalMovement: stockMovement;
      reversalMovement: stockMovement;
    }>(`${this._apiURL}/${this.endpoint}/${id}/reversal`, data);
  }
}
