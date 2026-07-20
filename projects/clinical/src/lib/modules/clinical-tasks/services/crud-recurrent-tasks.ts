import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { map, catchError, Observable, of } from 'rxjs';
import { recurrentTask } from '../interfaces/recurrent-task';

/** CRUD service for managing recurrent tasks */
@Injectable({ providedIn: 'root' })
export class CrudRecurrentTasks extends ApiRequestManager<recurrentTask> {
  constructor() {
    super();
    this.endpoint = 'recurrent-tasks';
  }

  /**
   * Fetches tasks associated with a contact
   * @param contactId - The contact ID to filter by
   * @returns Observable of the task list
   */
  getByContact(contactId: string): Observable<recurrentTask[]> {
    return this._httpClient
      .get<{
        docs: recurrentTask[];
      }>(`${this._apiURL}/${this.endpoint}`, { params: { contactId, limit: '100' } })
      .pipe(
        map(r => r.docs ?? []),
        catchError(() => of([]))
      );
  }
}
