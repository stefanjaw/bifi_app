import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { activityHistory, file, FileResolver } from '@avalantec/base-app/resource';
import { CardModule } from 'primeng/card';
import { FormModule } from '@avalantec/base-app/form';
import { assetCommissionning } from '../../../../asset-commissioning';
import { assetMaintenance } from '../../../../asset-maintenances';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AssetRosterActiviyHistoryAddFileDialog } from '../../../features/asset-roster-maintenance-add-file-dialog/asset-roster-activity-history-add-file-dialog';
import { assetRoster } from '../../../interfaces/asset-roster';
import { Tag, TagModule } from 'primeng/tag';
import { HasPermission } from '@avalantec/base-app/auth';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { LocaleDatePipe, TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-activity-history-section',
  imports: [
    CardModule,
    TagModule,
    CommonModule,
    FormModule,
    Button,
    Ripple,
    HasPermission,
    AssetRosterActiviyHistoryAddFileDialog,
    LocaleDatePipe,
    TranslatePipe,
  ],
  templateUrl: './activity-history-section.html',
})
export class ActivityHistorySection {
  private fileResolver = inject(FileResolver);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  selectedHistoryDocument = signal<assetCommissionning | assetMaintenance | null>(null);
  activityHistory =
    input.required<activityHistory<assetCommissionning | assetMaintenance | assetRoster>[]>();

  expandedIds = signal<Set<string>>(new Set());

  /** Toggles the expanded/collapsed state for a history entry */
  toggleExpand(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  getBadgeVariant(activity: activityHistory<any>): Tag['severity'] {
    switch (activity.title?.toLowerCase()) {
      case 'commissioned':
        return 'success';
      case 'commission failed':
        return 'warn';
      case 'decommissioned':
        return 'danger';
      default:
        return 'info';
    }
  }

  isNotValidForAttachmentAdding(modelId: Record<string, any>): modelId is assetRoster {
    return modelId['productModel'];
  }

  downloadFile(attachment: file) {
    this.fileResolver.downloadFileInBrowser({ metadata: attachment });
  }

  exportCSV() {
    this.assetRosterMaintenanceContext.handleExportActivityHistory();
  }
}
