import { Component, inject, input, signal } from '@angular/core';
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
import { filter, map } from 'rxjs';

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

  form = this.formService.form;

  fileUrl = signal<string | null>(null);

  constructor() {
    this.photoArray.valueChanges
      .pipe(
        filter(() => !!this.photoArray.controls.length), // Only proceed if the photo array contains controls
        map(() => this.photoArray.controls.length) // Map the stream to the length of the photo array
      )
      .subscribe(() => {
        const fileGroup = this.fileControl!; // Get the file control, which is the first control in the photo array
        if (fileGroup !== null) {
          // Set the file URL
          this.fileUrl.set(URL.createObjectURL(fileGroup.controls.file.value));
        }
      });
  }

  get photoArray() {
    return this.form.controls.photo;
  }

  get fileControl() {
    const controls = this.photoArray.controls;
    return controls.length > 0 ? controls[controls.length - 1] : null;
  }
}
