import { Component } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'bifi-app-activity-history-section',
  imports: [...AppFormExtensionsImports, CardModule],
  templateUrl: './activity-history-section.html',
})
export class ActivityHistorySection {}
