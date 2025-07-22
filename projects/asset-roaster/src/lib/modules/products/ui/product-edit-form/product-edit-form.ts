import { Component, inject, input, output } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { GeneralInformationSection } from './general-information-section/general-information-section';
import { DocumentsSection } from './documents-section/documents-section';
import { MaintenanceServiceSection } from './maintenance-service-section/maintenance-service-section';
import { CommissioningLifecycleSection } from './commissioning-lifecycle-section/commissioning-lifecycle-section';
import { ActivityHistorySection } from './activity-history-section/activity-history-section';
import { EquipmentForm } from '../../services/equipment-form';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'bifi-app-product-edit-form',
  imports: [
    ReactiveFormsModule,
    AppFormExtensionsImports,
    ButtonModule,
    DatePickerModule,
    CardModule,
    MessageModule,
    InputTextModule,
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
  formService = inject(EquipmentForm);

  toggleEdit = output<void>();
  save = output<void>();
  cancel = output<void>();
  backToDashboard = output<void>();
  commission = output<void>();
  addDocument = output<void>();
}
