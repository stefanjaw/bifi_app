import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { fluidTrackItem } from '../interfaces/fluid-tracks';

/** CRUD service for fluid track items */
@Injectable({ providedIn: 'root' })
export class CrudFluidTrackItems extends ApiRequestManager<fluidTrackItem> {
  constructor() {
    super();
    this.endpoint = 'fluid-track-items';
  }

  /**
   * Fetches fluid track items for a patient
   * @param patientId - The patient ID to filter by
   * @returns Observable of the fluid track items list
   */
  getByPatient(patientId: string): Observable<fluidTrackItem[]> {
    return this._httpClient
      .get<{
        docs: fluidTrackItem[];
      }>(`${this._apiURL}/${this.endpoint}`, { params: { patientId, limit: '200' } })
      .pipe(
        map(r => r.docs ?? []),
        catchError(() => of([]))
      );
  }
}
