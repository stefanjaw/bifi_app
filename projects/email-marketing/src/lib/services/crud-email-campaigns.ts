import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { emailCampaign } from '../interfaces/email-campaign';
import { emailDashboard } from '../interfaces/email-event';

@Injectable({
  providedIn: 'root',
})
export class CrudEmailCampaigns extends ApiRequestManager<emailCampaign> {
  constructor() {
    super();
    super.endpoint = 'email-campaigns';
  }

  getDashboard() {
    return rxResource<emailDashboard, void>({
      stream: () =>
        this._httpClient
          .get<emailDashboard>(`${this._apiURL}/${this.endpoint}/dashboard`)
          .pipe(catchError(() => of({} as emailDashboard))),
    });
  }

  sendTest(id: string, email: string): Observable<{ ok: boolean; message: string }> {
    return this._httpClient.post<{ ok: boolean; message: string }>(
      `${this._apiURL}/${this.endpoint}/${id}/send-test`,
      { email }
    );
  }

  sendNow(id: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/${this.endpoint}/${id}/send-now`,
      {}
    );
  }

  schedule(id: string, scheduledAt: string): Observable<emailCampaign> {
    return this._httpClient.post<emailCampaign>(
      `${this._apiURL}/${this.endpoint}/${id}/schedule`,
      { scheduledAt }
    );
  }

  cancel(id: string): Observable<emailCampaign> {
    return this._httpClient.post<emailCampaign>(
      `${this._apiURL}/${this.endpoint}/${id}/cancel`,
      {}
    );
  }
}
