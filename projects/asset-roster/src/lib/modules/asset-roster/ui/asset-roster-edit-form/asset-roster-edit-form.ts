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
import { NotesSection } from './notes-section/notes-section';
import { StatusBannerSection } from './status-banner-section/status-banner-section';

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
    NotesSection,
    CommissioningLifecycleSection,
    ActivityHistorySection,
    FinancialInformation,
    ProgressBarModule,
    Tabs,
    TabsModule,
    FormModule,
    HasPermission,
    StatusBannerSection,
  ],
  templateUrl: './asset-roster-edit-form.html',
  styleUrl: './asset-roster-edit-form.css',
})
export class AssetRosterEditForm {
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  assetRoster = input.required<assetRoster | undefined>();
  activityHistories = input.required<activityHistory<assetCommissionning | assetMaintenance>[]>();
  isLoading = input.required<boolean>();
  isSubmitLoading = input.required<boolean>();
  isEditMode = input.required<boolean>();
  isDirty = input<boolean>(false);
  prevAssetId = input<string | null>(null);
  nextAssetId = input<string | null>(null);
  currentIndex = input<number>(-1);
  totalAssets = input<number>(0);
  formService = inject(UpdateAssetRosterForm);

  // data to inject in children
  assetTypes = input<assetType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);
  maintenanceWindows = input<maintenanceWindow[]>([]);

  handleSave() {
    const remarksArray = this.formService.form.controls.remarks;

    for (let i = remarksArray.length - 1; i >= 0; i--) {
      const value = remarksArray.at(i).value;
      const remark = value?.remark;

      if (!value || typeof remark !== 'string' || remark.trim().length === 0) {
        remarksArray.removeAt(i);
      }
    }

    this.assetRosterMaintenanceContext.handleSave();
  }

  handleCancel() {
    this.assetRosterMaintenanceContext.handleCancel();
  }

  handleBackToDashboard() {
    this.assetRosterMaintenanceContext.handleBackToDashboard();
  }

  handleNavigatePrev() {
    this.assetRosterMaintenanceContext.handleNavigatePrevAsset();
  }

  handleNavigateNext() {
    this.assetRosterMaintenanceContext.handleNavigateNextAsset();
  }
}
