import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { intervention } from '../interfaces/care-plan';

/** CRUD service for interventions */
@Injectable({ providedIn: 'root' })
export class CrudInterventions extends ApiRequestManager<intervention> {
  constructor() {
    super();
    this.endpoint = 'interventions';
  }

  /**
   * Fetches interventions for a patient
   * @param patientId - The patient ID to filter by
   * @returns Observable of the intervention list
   */
  getByPatient(patientId: string): Observable<intervention[]> {
    return this._httpClient
      .get<{
        docs: intervention[];
      }>(`${this._apiURL}/${this.endpoint}`, { params: { patientId, limit: '100' } })
      .pipe(
        map(r => r.docs ?? []),
        catchError(() => of([]))
      );
  }
}
