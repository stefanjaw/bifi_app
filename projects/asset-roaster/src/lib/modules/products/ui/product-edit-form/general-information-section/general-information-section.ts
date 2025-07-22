import { Component, inject, input } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { EquipmentForm } from '../../../services/equipment-form';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'bifi-app-general-information-section',
  imports: [
    ...AppFormExtensionsImports,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    FileUploadModule,
    CardModule,
    MessageModule,
  ],
  templateUrl: './general-information-section.html',
})
export class GeneralInformationSection {
  isEditMode = input.required<boolean>();
  formService = inject(EquipmentForm);
}
