import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Badge, BadgeVariant } from '@avalantec/base-app/ui';
import { activityHistory, file, FileResolver } from '@avalantec/base-app/resource';
import { CardModule } from 'primeng/card';
import { FormModule } from '@avalantec/base-app/form';
import { productCommissionning } from '../../../../product-commissioning';
import { productMaintenance } from '../../../../product-maintenances';
import { Button } from 'primeng/button';
import { ProductActiviyHistoryAddFileDialog } from '../../../features/product-maintenance-add-file-dialog/product-activity-history-add-file-dialog';
import { product } from '../../../interfaces/product';

@Component({
  selector: 'bifi-app-activity-history-section',
  imports: [
    CardModule,
    Badge,
    CommonModule,
    FormModule,
    Button,
    ProductActiviyHistoryAddFileDialog,
  ],
  templateUrl: './activity-history-section.html',
})
export class ActivityHistorySection {
  private fileResolver = inject(FileResolver);

  selectedHistoryDocument = signal<productCommissionning | productMaintenance | null>(null);
  activityHistory =
    input.required<activityHistory<productCommissionning | productMaintenance | product>[]>();

  async downloadFile(attachment: file) {
    this.fileResolver.downloadFileInBrowser({ metadata: attachment });
  }

  getBadgeVariant(activity: activityHistory<any>): BadgeVariant {
    switch (activity.title?.toLowerCase()) {
      case 'commissioned':
        return 'success';
      case 'commission failed':
        return 'warning';
      case 'decommissioned':
        return 'error';
      default:
        return 'info';
    }
  }

  isNotValidForAttachmentAdding(modelId: Record<string, any>): modelId is product {
    return modelId['productModel'];
  }
}
