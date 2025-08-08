import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Badge } from '@avalantec/base-app/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { activityHistory } from '@avalantec/base-app/resource';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'bifi-app-activity-history-section',
  imports: [AppFormExtensionsImports, CardModule, Badge, CommonModule],
  templateUrl: './activity-history-section.html',
})
export class ActivityHistorySection {
  activityHistory = input.required<activityHistory[]>();
}
