import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { ticket } from '../interfaces/ticket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudTickets extends ApiRequestManager<ticket> {
  constructor() {
    super();
    super.endpoint = 'tickets';
  }

  getReport<R = unknown>(): Observable<R> {
    const url = `${this.formatFullURL()}/report`;
    return this._httpClient.get<R>(url);
  }
}
