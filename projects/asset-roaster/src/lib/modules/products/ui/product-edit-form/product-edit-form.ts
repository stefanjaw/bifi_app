import { Component, input, output } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app';
import { ButtonModule } from 'primeng/button';
import { GeneralInformationSection } from './general-information-section/general-information-section';
import { DocumentsSection } from './documents-section/documents-section';
import { MaintenanceServiceSection } from './maintenance-service-section/maintenance-service-section';
import { CommissioningLifecycleSection } from './commissioning-lifecycle-section/commissioning-lifecycle-section';
import { ActivityHistorySection } from './activity-history-section/activity-history-section';
import type { EquipmentForm } from '../../services/equipment-form';

@Component({
  selector: 'bifi-app-product-edit-form',
  imports: [
    AppFormExtensionsImports,
    ButtonModule,
    GeneralInformationSection,
    DocumentsSection,
    MaintenanceServiceSection,
    CommissioningLifecycleSection,
    ActivityHistorySection,
  ],
  templateUrl: './product-edit-form.html',
})
export class ProductEditForm {
  isEditMode = input.required<boolean>();
  formService = input.required<EquipmentForm>();

  toggleEdit = output<void>();
  save = output<void>();
  cancel = output<void>();
  backToDashboard = output<void>();
  commission = output<void>();
  addDocument = output<void>();
}
