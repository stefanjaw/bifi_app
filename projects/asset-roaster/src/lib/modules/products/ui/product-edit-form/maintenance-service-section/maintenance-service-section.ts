import { Component, inject, input } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { EquipmentForm } from '../../../services/equipment-form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'bifi-app-maintenance-service-section',
  imports: [AppFormExtensionsImports, ReactiveFormsModule, InputTextModule, CardModule],
  templateUrl: './maintenance-service-section.html',
})
export class MaintenanceServiceSection {
  isEditMode = input.required<boolean>();
  formService = inject(EquipmentForm);
}
