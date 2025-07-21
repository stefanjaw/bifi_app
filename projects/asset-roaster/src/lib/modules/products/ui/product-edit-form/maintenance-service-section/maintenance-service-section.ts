import { Component, input } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import type { EquipmentForm } from '../../../services/equipment-form';

@Component({
  selector: 'bifi-app-maintenance-service-section',
  imports: [AppFormExtensionsImports, InputTextModule, CardModule],
  templateUrl: './maintenance-service-section.html',
})
export class MaintenanceServiceSection {
  isEditMode = input.required<boolean>();
  formService = input.required<EquipmentForm>();
}
