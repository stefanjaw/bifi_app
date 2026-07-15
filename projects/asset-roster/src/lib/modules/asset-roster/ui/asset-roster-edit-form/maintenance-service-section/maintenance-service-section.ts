import { Component, computed, effect, inject, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { ReactiveFormsModule } from '@angular/forms';
import { assetRoster } from '../../../interfaces/asset-roster';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { maintenanceWindow } from '../../../../maintenance-windows';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { preventiveMaintenanceStatus } from './maintenance-status.model';
import { FormModule } from '@avalantec/base-app/form';
import { LocaleDatePipe, TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-maintenance-service-section',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CardModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    FormModule,
    LocaleDatePipe,
    TranslatePipe,
  ],
  templateUrl: './maintenance-service-section.html',
})
export class MaintenanceServiceSection {
  // inputs
  isEditMode = input.required<boolean>();
  assetRoster = input.required<assetRoster | undefined>();

  // services
  protected formService = inject(UpdateAssetRosterForm);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  // data
  maintenanceWindows = input<maintenanceWindow[]>([]);

  // computed
  isMaintenanceWindowsEditLocked = computed(() => {
    const assetRoster = this.assetRoster();

    if (!assetRoster) return false;

    return assetRoster.maintenanceWindowIds?.length > 0;
  });

  // to check if PM can be started
  canStartOrSkipPM = computed(() => {
    const assetRoster = this.assetRoster();
    const today = dayjs();
    const minMaintenanceDate = dayjs(this.assetRoster()?.minMaintenanceDate);

    // Some checkings
    if (
      !assetRoster ||
      !assetRoster.assetCommission ||
      assetRoster.assetCommission.outcome === 'fail' ||
      assetRoster.status === 'decommissioned' ||
      this.serviceStarted() ||
      this.pmStarted() ||
      !assetRoster.maintenanceWindowIds ||
      assetRoster.maintenanceWindowIds.length === 0 ||
      today.isBefore(minMaintenanceDate)
    )
      return false;

    return true;
  });

  // to check if service can be started
  canStartService = computed(() => {
    const assetRoster = this.assetRoster();

    if (
      !assetRoster ||
      !assetRoster.assetCommission ||
      assetRoster.assetCommission.outcome === 'fail' ||
      assetRoster.status === 'decommissioned'
    )
      return false;

    return !this.serviceStarted() && !this.pmStarted();
  });

  // to check if PM is currently active (a finished PM has active === false)
  pmStarted = computed(() => {
    return !!this.assetRoster()?.assetMaintenances.find(
      m => m.type === 'preventive-maintenance' && m.active
    );
  });

  // to check if a service is currently active
  serviceStarted = computed(() => {
    return !!this.assetRoster()?.assetMaintenances.find(m => m.type === 'service' && m.active);
  });

  // to get current (active) PM
  currPM = computed(() => {
    return this.assetRoster()?.assetMaintenances.find(
      m => m.type === 'preventive-maintenance' && m.active
    );
  });

  // to get current (active) service
  currService = computed(() => {
    return this.assetRoster()?.assetMaintenances.find(m => m.type === 'service' && m.active);
  });

  pmScheduleStatus = computed(() => {
    const assetRoster = this.assetRoster();
    const canStartPM = this.canStartOrSkipPM();
    const pmStarted = this.pmStarted();
    const serviceStarted = this.serviceStarted();

    let status: preventiveMaintenanceStatus = 'not-commissioned';

    if (!assetRoster || (!assetRoster.assetCommission && assetRoster.status !== 'decommissioned'))
      return status;

    if (assetRoster.status === 'decommissioned') status = 'decommissioned';
    else if (!assetRoster.maintenanceWindowIds || assetRoster.maintenanceWindowIds.length === 0)
      status = 'not-scheduled';
    else if (serviceStarted && !pmStarted) status = 'under-service';
    else if (canStartPM) status = 'available';
    else if (pmStarted) status = 'in-progress';
    else status = 'finished';

    return status;
  });

  constructor() {
    effect(() => {
      if (this.isMaintenanceWindowsEditLocked()) {
        this.formService.form.get('maintenanceWindowIds')?.disable();
        this.formService.form.get('maintenanceDate')?.disable();
      } else {
        this.formService.form.get('maintenanceWindowIds')?.enable();
        this.formService.form.get('maintenanceDate')?.enable();
      }
    });
  }

  handleOpenSkipPMDialog() {
    this.assetRosterMaintenanceContext.handleOpenSkipPMDialog();
  }

  handleInitPM() {
    this.assetRosterMaintenanceContext.handleInitPM();
  }

  handleOpenFinishPMDialog() {
    this.assetRosterMaintenanceContext.handleOpenFinishPMDialog();
  }

  handleOpenServiceDialog() {
    this.assetRosterMaintenanceContext.handleOpenServiceDialog();
  }

  handleOpenFinishServiceDialog() {
    this.assetRosterMaintenanceContext.handleOpenFinishServiceDialog();
  }
}
