import { Injectable } from '@angular/core';
import { ApiRequestManager } from './api-request-manager';
import { activityHistory } from '../interfaces/activity-history';

@Injectable({
  providedIn: 'root',
})
export class CrudActivityHistories extends ApiRequestManager<activityHistory> {
  constructor() {
    super();
    super.endpoint = 'activity-histories';
  }
}
