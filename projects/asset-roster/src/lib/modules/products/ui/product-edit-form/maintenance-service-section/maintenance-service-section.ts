import { Component, computed, effect, inject, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { UpdateProductForm } from '../../../services/update-product-form';
import { ReactiveFormsModule } from '@angular/forms';
import { product } from '../../../interfaces/product';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { maintenanceWindow } from '../../../../maintenance-windows';
import { ProductMaintenanceContext } from '../../../services/product-maintenance-context';
import { preventiveMaintenanceStatus } from './maintenance-status.model';
import { FormModule } from '@avalantec/base-app/form';

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
  ],
  templateUrl: './maintenance-service-section.html',
})
export class MaintenanceServiceSection {
  // inputs
  isEditMode = input.required<boolean>();
  product = input.required<product | undefined>();

  // services
  protected formService = inject(UpdateProductForm);
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  // data
  maintenanceWindows = input<maintenanceWindow[]>([]);

  // computed
  isMaintenanceWindowsEditLocked = computed(() => {
    const product = this.product();

    if (!product) return false;

    return product.maintenanceWindowIds?.length > 0;
  });

  // to check if PM can be started
  canStartOrSkipPM = computed(() => {
    const product = this.product();
    const today = dayjs();
    const minMaintenanceDate = dayjs(this.product()?.minMaintenanceDate);

    // Some checkings
    if (
      !product ||
      !product.productCommission ||
      product.productCommission.outcome === 'fail' ||
      product.status === 'decommissioned' ||
      this.serviceStarted() ||
      this.pmStarted() ||
      !product.maintenanceWindowIds ||
      product.maintenanceWindowIds.length === 0 ||
      today.isBefore(minMaintenanceDate)
    )
      return false;

    return true;
  });

  // to check if service can be started
  canStartService = computed(() => {
    const product = this.product();

    if (
      !product ||
      !product.productCommission ||
      product.productCommission.outcome === 'fail' ||
      product.status === 'decommissioned'
    )
      return false;

    return !this.serviceStarted() && !this.isEditMode();
  });

  // to check if PM is started
  pmStarted = computed(() => {
    return !!this.product()?.productMaintenances.find(m => m.type === 'preventive-maintenance');
  });

  // to check if service is started
  serviceStarted = computed(() => {
    return !!this.product()?.productMaintenances.find(m => m.type === 'service');
  });

  // to get current PM
  currPM = computed(() => {
    return this.product()?.productMaintenances.find(m => m.type === 'preventive-maintenance');
  });

  // to get current service
  currService = computed(() => {
    return this.product()?.productMaintenances.find(m => m.type === 'service');
  });

  pmScheduleStatus = computed(() => {
    const product = this.product();
    const canStartPM = this.canStartOrSkipPM();
    const pmStarted = this.pmStarted();
    const serviceStarted = this.serviceStarted();

    let status: preventiveMaintenanceStatus = 'not-commissioned';

    if (!product || (!product.productCommission && product.status !== 'decommissioned'))
      return status;

    if (product.status === 'decommissioned') status = 'decommissioned';
    else if (!product.maintenanceWindowIds || product.maintenanceWindowIds.length === 0)
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
    this.productMaintenanceContext.handleOpenSkipPMDialog();
  }

  handleInitPM() {
    this.productMaintenanceContext.handleInitPM();
  }

  handleOpenFinishPMDialog() {
    this.productMaintenanceContext.handleOpenFinishPMDialog();
  }

  handleOpenServiceDialog() {
    this.productMaintenanceContext.handleOpenServiceDialog();
  }

  handleOpenFinishServiceDialog() {
    this.productMaintenanceContext.handleOpenFinishServiceDialog();
  }
}
