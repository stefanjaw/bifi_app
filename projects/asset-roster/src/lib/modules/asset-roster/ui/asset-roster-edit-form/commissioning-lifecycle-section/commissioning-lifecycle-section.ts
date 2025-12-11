import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { assetRoster } from '../../../interfaces/asset-roster';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { FormModule } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-commissioning-lifecycle-section',
  imports: [ButtonModule, CardModule, FormModule],
  templateUrl: './commissioning-lifecycle-section.html',
})
export class CommissioningLifecycleSection {
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  assetRoster = input.required<assetRoster | undefined>();
  isEditMode = input.required<boolean>();

  handleOpencommissionDialog() {
    this.assetRosterMaintenanceContext.handleOpenCommissionDialog();
  }

  handleOpenDecommissionDialog() {
    this.assetRosterMaintenanceContext.handleOpenDecommissionDialog();
  }
}
