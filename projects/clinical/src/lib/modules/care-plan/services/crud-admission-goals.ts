import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { admissionGoal } from '../interfaces/care-plan';

/** CRUD service for admission goals */
@Injectable({ providedIn: 'root' })
export class CrudAdmissionGoals extends ApiRequestManager<admissionGoal> {
  constructor() {
    super();
    this.endpoint = 'admission-goals';
  }

  /**
   * Fetches admission goals for a patient
   * @param patientId - The patient ID to filter by
   * @returns Observable of the admission goals list
   */
  getByPatient(patientId: string): Observable<admissionGoal[]> {
    return this._httpClient
      .get<{
        docs: admissionGoal[];
      }>(`${this._apiURL}/${this.endpoint}`, { params: { patientId, limit: '100' } })
      .pipe(
        map(r => r.docs ?? []),
        catchError(() => of([]))
      );
  }
}
