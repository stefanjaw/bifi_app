import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { assetRoster } from '../../../interfaces/asset-roster';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { assetType } from '../../../../asset-types';

@Component({
  selector: 'bifi-app-asset-roster-financial-information',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    FileUploadModule,
    CardModule,
    CommonModule,
    SelectModule,
    FormModule,
  ],
  templateUrl: './financial-information.html',
})
export class FinancialInformation {
  assetRoster = input.required<assetRoster | undefined>();

  // * DATA
  assetTypes = input<assetType[]>([]);

  isEditMode = input.required<boolean>();
  formService = inject(UpdateAssetRosterForm);

  form = this.formService.form;
}
