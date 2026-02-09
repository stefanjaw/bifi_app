import { HasPermission } from '@avalantec/base-app/auth';
import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GeneralInformationSection } from './general-information-section/general-information-section';
import { DocumentsSection } from './documents-section/documents-section';
import { MaintenanceServiceSection } from './maintenance-service-section/maintenance-service-section';
import { CommissioningLifecycleSection } from './commissioning-lifecycle-section/commissioning-lifecycle-section';
import { ActivityHistorySection } from './activity-history-section/activity-history-section';
import { UpdateAssetRosterForm } from '../../services/update-asset-roster-form';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { assetRoster } from '../../interfaces/asset-roster';
import { ProgressBarModule } from 'primeng/progressbar';
import { room } from '../../../facilities';
import { maintenanceWindow } from '../../../maintenance-windows';
import { assetType } from '../../../asset-types';
import { AssetRosterMaintenanceContext } from '../../services/asset-roster-maintenance-context';
import { activityHistory } from '@avalantec/base-app/resource';
import { FormModule } from '@avalantec/base-app/form';
import { assetMaintenance } from '../../../asset-maintenances/interfaces/asset-maintenance';
import { assetCommissionning } from '../../../asset-commissioning/interfaces/asset-commissioning';
import { contact } from '@avalantec/base-app/interfaces';
import { Tabs, TabsModule } from 'primeng/tabs';
import { FinancialInformation } from './financial-information-section/financial-information';

@Component({
  selector: 'bifi-app-asset-roster-edit-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    CardModule,
    InputTextModule,
    GeneralInformationSection,
    DocumentsSection,
    MaintenanceServiceSection,
    CommissioningLifecycleSection,
    ActivityHistorySection,
    FinancialInformation,
    ProgressBarModule,
    Tabs,
    TabsModule,
    FormModule,
    HasPermission,
  ],
  templateUrl: './asset-roster-edit-form.html',
})
export class AssetRosterEditForm {
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  assetRoster = input.required<assetRoster | undefined>();
  activityHistories = input.required<activityHistory<assetCommissionning | assetMaintenance>[]>();
  isLoading = input.required<boolean>();
  isSubmitLoading = input.required<boolean>();
  isEditMode = input.required<boolean>();
  formService = inject(UpdateAssetRosterForm);

  // data to inject in children
  assetTypes = input<assetType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);
  maintenanceWindows = input<maintenanceWindow[]>([]);

  handleSave() {
    this.assetRosterMaintenanceContext.handleSave();
  }

  handleCancel() {
    this.assetRosterMaintenanceContext.handleCancel();
  }

  toggleEdit() {
    this.assetRosterMaintenanceContext.toggleEditMode();
  }

  handleBackToDashboard() {
    this.assetRosterMaintenanceContext.handleBackToDashboard();
  }
}
