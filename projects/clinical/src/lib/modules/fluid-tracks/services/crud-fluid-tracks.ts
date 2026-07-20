import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { fluidTrack } from '../interfaces/fluid-tracks';

/** CRUD service for managing fluid tracks */
@Injectable({ providedIn: 'root' })
export class CrudFluidTracks extends ApiRequestManager<fluidTrack> {
  constructor() {
    super();
    this.endpoint = 'fluid-tracks';
  }

  /**
   * Fetches the count of fluid tracks for a patient
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
