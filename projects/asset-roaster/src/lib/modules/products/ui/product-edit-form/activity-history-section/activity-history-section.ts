import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Badge } from '@avalantec/base-app/ui';
import { activityHistory } from '@avalantec/base-app/resource';
import { CardModule } from 'primeng/card';
import { FormModule } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-activity-history-section',
  imports: [CardModule, Badge, CommonModule, FormModule],
  templateUrl: './activity-history-section.html',
})
export class ActivityHistorySection {
  activityHistory = input.required<activityHistory[]>();
}
