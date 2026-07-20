import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { progressNote } from '../interfaces/progress-notes';

/** CRUD service for progress notes */
@Injectable({ providedIn: 'root' })
export class CrudProgressNotes extends ApiRequestManager<progressNote> {
  constructor() {
    super();
    this.endpoint = 'progress-notes';
  }

  /**
   * Fetches the count of progress notes for a patient
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
