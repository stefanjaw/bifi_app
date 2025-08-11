import { Component, inject, input } from '@angular/core';
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
import {
  FormError,
  FormField,
  FormFileControlHelper,
  FormLabel,
  FormPreview,
  FormSection,
} from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-general-information-section',
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
    StatusBannerSection,
    FormSection,
    FormField,
    FormLabel,
    FormError,
    FormPreview,
  ],
  templateUrl: './general-information-section.html',
})
export class GeneralInformationSection {
  private fileHelper = inject(FormFileControlHelper);

  product = input.required<product | null>();

  // * DATA
  productTypes = input<productType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);

  isEditMode = input.required<boolean>();
  formService = inject(UpdateProductForm);

  form = this.formService.form;

  // Generate file state
  private fileState = this.fileHelper.generateMetadataFromFileControl(this.photoArray);
  uploadedFile = this.fileState.firstFile;

  get photoArray() {
    return this.form.controls.photo;
  }

  getTypeName(typeId: string) {
    return this.productTypes().find(p => p._id === typeId)?.name;
  }
}
