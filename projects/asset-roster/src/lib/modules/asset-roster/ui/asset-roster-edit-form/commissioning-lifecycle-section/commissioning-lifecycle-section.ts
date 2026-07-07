import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { assetRoster } from '../../../interfaces/asset-roster';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { FormModule } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-commissioning-lifecycle-section',
  imports: [ButtonModule, CardModule, FormModule, TranslatePipe],
  templateUrl: './commissioning-lifecycle-section.html',
})
export class CommissioningLifecycleSection {
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  assetRoster = input.required<assetRoster | undefined>();

  handleOpencommissionDialog() {
    this.assetRosterMaintenanceContext.handleOpenCommissionDialog();
  }

  handleOpenDecommissionDialog() {
    this.assetRosterMaintenanceContext.handleOpenDecommissionDialog();
  }
}
