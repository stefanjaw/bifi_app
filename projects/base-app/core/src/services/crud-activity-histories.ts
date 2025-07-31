import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
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
