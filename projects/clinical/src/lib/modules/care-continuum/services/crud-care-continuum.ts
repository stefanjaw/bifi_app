import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { careContinuum } from '../interfaces/care-continuum';

/** CRUD service for care continuum records */
@Injectable({ providedIn: 'root' })
export class CrudCareContinuum extends ApiRequestManager<careContinuum> {
  constructor() {
    super();
    this.endpoint = 'care-continuums';
  }

  /**
   * Fetches the count of care continuum records for a patient
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
