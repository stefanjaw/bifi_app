import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { vitalSign } from '../interfaces/vital-signs';

/** CRUD service for managing vital signs */
@Injectable({ providedIn: 'root' })
export class CrudVitalSigns extends ApiRequestManager<vitalSign> {
  constructor() {
    super();
    this.endpoint = 'vital-signs';
  }

  /**
   * Fetches the count of vital signs for a patient
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
