import { Component, inject, input } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { GeneralInformationSection } from './general-information-section/general-information-section';
import { DocumentsSection } from './documents-section/documents-section';
import { MaintenanceServiceSection } from './maintenance-service-section/maintenance-service-section';
import { CommissioningLifecycleSection } from './commissioning-lifecycle-section/commissioning-lifecycle-section';
import { ActivityHistorySection } from './activity-history-section/activity-history-section';
import { UpdateProductForm } from '../../services/update-product-form';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { product } from '../../interfaces/product';
import { ProgressBarModule } from 'primeng/progressbar';
import { room } from '../../../facilities';
import { maintenanceWindow } from '../../../maintenance-windows';
import { productType } from '../../../product-types';
import { contact } from '@avalantec/base-app/settings';
import { ProductMaintenanceContext } from '../../services/product-maintenance-context';

@Component({
  selector: 'bifi-app-product-edit-form',
  imports: [
    ReactiveFormsModule,
    AppFormExtensionsImports,
    ButtonModule,
    DatePickerModule,
    CardModule,
    InputTextModule,
    GeneralInformationSection,
    DocumentsSection,
    MaintenanceServiceSection,
    CommissioningLifecycleSection,
    ActivityHistorySection,
    ProgressBarModule,
  ],
  templateUrl: './product-edit-form.html',
})
export class ProductEditForm {
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  product = input.required<product | null>();
  isLoading = input.required<boolean>();
  isSubmitLoading = input.required<boolean>();
  isEditMode = input.required<boolean>();
  formService = inject(UpdateProductForm);

  // data to inject in children
  productTypes = input<productType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);
  maintenaceWindows = input<maintenanceWindow[]>([]);

  handleSave() {
    this.productMaintenanceContext.handleSave();
  }

  handleCancel() {
    this.productMaintenanceContext.handleCancel();
  }

  toggleEdit() {
    this.productMaintenanceContext.toggleEditMode();
  }

  handleBackToDashboard() {
    this.productMaintenanceContext.handleBackToDashboard();
  }
}
