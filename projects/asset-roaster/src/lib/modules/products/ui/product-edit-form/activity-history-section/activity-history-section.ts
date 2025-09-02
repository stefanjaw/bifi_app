import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Badge } from '@avalantec/base-app/ui';
import { activityHistory, file, FileResolver } from '@avalantec/base-app/resource';
import { CardModule } from 'primeng/card';
import { FormModule } from '@avalantec/base-app/form';
import { product } from '../../../interfaces/product';
import { productComissionning } from '../../../../product-comissioning';
import { productMaintenance } from '../../../../product-maintenances';
import { Button } from 'primeng/button';

@Component({
  selector: 'bifi-app-activity-history-section',
  imports: [CardModule, Badge, CommonModule, FormModule, Button],
  templateUrl: './activity-history-section.html',
})
export class ActivityHistorySection {
  private fileResolver = inject(FileResolver);

  activityHistory =
    input.required<activityHistory<product | productComissionning | productMaintenance>[]>();

  async downloadFile(attachment: file) {
    this.fileResolver.downloadFileInBrowser({ metadata: attachment });
  }
}
