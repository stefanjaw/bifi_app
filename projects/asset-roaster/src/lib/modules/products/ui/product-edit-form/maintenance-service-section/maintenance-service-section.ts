import { Component, computed, effect, inject, input } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { UpdateProductForm } from '../../../services/update-product-form';
import { ReactiveFormsModule } from '@angular/forms';
import { product } from '../../../interfaces/product';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { maintenanceWindow } from '../../../../maintenance-windows';
import { ProductMaintenanceContext } from '../../../services/product-maintenance-context';
import { preventiveMaintenanceStatus } from './maintenance-status.model';

dayjs.extend(isBetween);

@Component({
  selector: 'bifi-app-maintenance-service-section',
  imports: [
    AppFormExtensionsImports,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CardModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
  ],
  templateUrl: './maintenance-service-section.html',
})
export class MaintenanceServiceSection {
  // inputs
  isEditMode = input.required<boolean>();
  product = input.required<product | null>();

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
  canStartPM = computed(() => {
    const product = this.product();

    // Some checkings
    if (
      !product ||
      !product.productComission ||
      product.productComission.outcome === 'fail' ||
      product.status === 'decomissioned' ||
      this.serviceStarted() ||
      this.pmStarted()
    )
      return false;

    const today = dayjs();
    const minMaintenanceDate = dayjs(this.product()?.minMaintenanceDate);
    const maxMaintenanceDate = dayjs(this.product()?.maxMaintenanceDate);

    return today.isBetween(minMaintenanceDate, maxMaintenanceDate);
  });

  // to check if service can be started
  canStartService = computed(() => {
    const product = this.product();

    if (
      !product ||
      !product.productComission ||
      product.productComission.outcome === 'fail' ||
      product.status === 'decomissioned'
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
    const canStartPM = this.canStartPM();
    const pmStarted = this.pmStarted();
    const serviceStarted = this.serviceStarted();

    let status: preventiveMaintenanceStatus = 'not-comissioned';

    if (!product || !product.productComission) return status;

    if (product.status === 'decomissioned') status = 'decomissioned';
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
