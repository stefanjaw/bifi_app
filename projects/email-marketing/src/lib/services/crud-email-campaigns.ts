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

  /** Returns a reactive resource ref with email campaign dashboard stats */
  getDashboard() {
    return rxResource<emailDashboard, void>({
      stream: () =>
        this._httpClient
          .get<emailDashboard>(`${this._apiURL}/${this.endpoint}/dashboard`)
          .pipe(catchError(() => of({} as emailDashboard))),
    });
  }

  /**
   * Sends a test email for the given campaign to a specific address
   * @param id - The campaign ID
   * @param email - The recipient email address for the test
   * @returns Observable with ok status and message
   */
  sendTest(id: string, email: string): Observable<{ ok: boolean; message: string }> {
    return this._httpClient.post<{ ok: boolean; message: string }>(
      `${this._apiURL}/${this.endpoint}/${id}/send-test`,
      { email }
    );
  }

  /**
   * Immediately sends the campaign to all subscribers
   * @param id - The campaign ID to send
   * @returns Observable of the send operation result
   */
  sendNow(id: string): Observable<any> {
    return this._httpClient.post<any>(`${this._apiURL}/${this.endpoint}/${id}/send-now`, {});
  }

  /**
   * Schedules the campaign for future delivery
   * @param id - The campaign ID to schedule
   * @param scheduledAt - ISO date string for the scheduled delivery time
   * @returns Observable of the updated email campaign
   */
  schedule(id: string, scheduledAt: string): Observable<emailCampaign> {
    return this._httpClient.post<emailCampaign>(`${this._apiURL}/${this.endpoint}/${id}/schedule`, {
      scheduledAt,
    });
  }

  /**
   * Cancels a scheduled or draft campaign
   * @param id - The campaign ID to cancel
   * @returns Observable of the cancelled email campaign
   */
  cancel(id: string): Observable<emailCampaign> {
    return this._httpClient.post<emailCampaign>(
      `${this._apiURL}/${this.endpoint}/${id}/cancel`,
      {}
    );
  }
}
