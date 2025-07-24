import { Component, inject, input } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { UpdateProductForm } from '../../../services/update-product-form';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { product } from '../../../interfaces/product';
import { StatusBannerSection } from '../status-banner-section/status-banner-section';
import { productType } from '../../../../product-types';
import { contact } from '@avalantec/base-app/settings';
import { room } from '../../../../facilities';

@Component({
  selector: 'bifi-app-general-information-section',
  imports: [
    AppFormExtensionsImports,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    FileUploadModule,
    CardModule,
    CommonModule,
    SelectModule,
    StatusBannerSection,
  ],
  templateUrl: './general-information-section.html',
})
export class GeneralInformationSection {
  product = input.required<product | null>();

  // * DATA
  productTypes = input<productType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);

  isEditMode = input.required<boolean>();
  formService = inject(UpdateProductForm);
}
