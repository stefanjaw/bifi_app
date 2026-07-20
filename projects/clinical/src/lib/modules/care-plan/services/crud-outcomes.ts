import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { outcome } from '../interfaces/care-plan';

/** CRUD service for outcomes */
@Injectable({ providedIn: 'root' })
export class CrudOutcomes extends ApiRequestManager<outcome> {
  constructor() {
    super();
    this.endpoint = 'outcomes';
  }

  /**
   * Fetches outcomes for a patient
   * @param patientId - The patient ID to filter by
   * @returns Observable of the outcome list
   */
  getByPatient(patientId: string): Observable<outcome[]> {
    return this._httpClient
      .get<{
        docs: outcome[];
      }>(`${this._apiURL}/${this.endpoint}`, { params: { patientId, limit: '100' } })
      .pipe(
        map(r => r.docs ?? []),
        catchError(() => of([]))
      );
  }
}
