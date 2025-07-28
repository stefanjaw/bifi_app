import { Component, computed, effect, inject, input, output } from '@angular/core';
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

  // outputs
  initiatePM = output<void>();
  finishPM = output<void>();

  // services
  formService = inject(UpdateProductForm);

  // data
  maintenanceWindows = input<maintenanceWindow[]>([]);

  // computed
  isMaintenanceWindowsEditLocked = computed(() => {
    const product = this.product();

    if (!product) return false;

    return product.maintenanceWindowIds?.length > 0;
  });

  pmInitiated = computed(() => {
    return !!this.product()?.productMaintenances.find(m => m.type === 'preventive-maintenance');
  });

  pmCanBeStarted = computed(() => {
    const product = this.product();

    if (!product) return false;

    // check if service is initiated, if so, cannot start pm
    if (!product.productMaintenances.find(m => m.type === 'service')) return false;

    // check if pm is already initiated
    if (this.pmInitiated()) return false;

    const today = dayjs();
    const minMaintenanceDate = dayjs(this.product()?.minMaintenanceDate);
    const maxMaintenanceDate = dayjs(this.product()?.maxMaintenanceDate);

    return today.isBetween(minMaintenanceDate, maxMaintenanceDate);
  });

  pmScheduleStatus = computed(() => {
    const product = this.product();
    const pmInitiated = this.pmInitiated();
    const pmCanBeStarted = this.pmCanBeStarted();

    let status: {
      label: string;
      className: string;
    } = {
      label: '',
      className: '',
    };

    if (!product) return status;

    // dates to reuse
    const maintenanceDate = dayjs(product.maintenanceDate).format('MM/DD/YYYY');
    const minMaintenanceDate = dayjs(product.minMaintenanceDate).format('MM/DD/YYYY');
    const maxMaintenanceDate = dayjs(product.maxMaintenanceDate).format('MM/DD/YYYY');

    if (!product.productComission) {
      status = {
        label: 'This equipment is awaiting commissioning. PM schedule cannot be determined yet.',
        className: 'text-orange-500',
      };
    } else if (!product.maintenanceWindowIds || product.maintenanceWindowIds.length === 0) {
      status = {
        label:
          'No active preventive maintenance schedule. Set an interval and first PM date to begin.',
        className: '',
      };
    } else if (pmCanBeStarted && !pmInitiated) {
      status = {
        label: `PM Due on ${maintenanceDate}. (Window: ${minMaintenanceDate} - ${maxMaintenanceDate}).`,
        className: 'text-green-500',
      };
    } else if (pmInitiated) {
      const pmDate = dayjs(
        product.productMaintenances.find(m => m.type === 'preventive-maintenance')?.date
      ).format('MM/DD/YYYY');

      status = {
        label: `PM In Progress, initiated on ${pmDate}.`,
        className: 'text-blue-500',
      };
    } else {
      status = {
        label: `Next Scheduled PM: ${maintenanceDate}.`,
        className: '',
      };
    }

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
}
