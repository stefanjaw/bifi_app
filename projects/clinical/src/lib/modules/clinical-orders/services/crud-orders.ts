import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { order } from '../interfaces/clinical-orders';

/** CRUD service for clinical orders */
@Injectable({ providedIn: 'root' })
export class CrudOrders extends ApiRequestManager<order> {
  constructor() {
    super();
    this.endpoint = 'orders';
  }

  /**
   * Fetches the count of orders for a patient
   * @param patientId - The patient ID to filter by
   * @returns Observable of the record count
   */
  getCountByPatient(patientId: string): Observable<number> {
    return this._httpClient
      .get<{
        totalDocs: number;
      }>(`${this._apiURL}/${this.endpoint}`, { params: { patientId, limit: '1' } })
      .pipe(
        map(r => r.totalDocs ?? 0),
        catchError(() => of(0))
      );
  }
}
