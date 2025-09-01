import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Badge } from '@avalantec/base-app/ui';
import { activityHistory, FileResolver } from '@avalantec/base-app/resource';
import { CardModule } from 'primeng/card';
import { FormModule, FormUploaderFile } from '@avalantec/base-app/form';
import { product } from '../../../interfaces/product';
import { productComissionnig } from '../../../../product-comissioning';
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
    input.required<activityHistory<product | productComissionnig | productMaintenance>[]>();

  downloadFile(attachment: FormUploaderFile) {
    this.fileResolver.downloadFileInBrowser({ file: attachment.file });
  }
}
