import { Component, inject, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { assetRoster } from '../../../interfaces/asset-roster';
import { StatusBannerSection } from '../status-banner-section/status-banner-section';
import { assetType } from '../../../../asset-types';
import { contact } from '@avalantec/base-app/interfaces';
import { room } from '../../../../facilities';
import { FormFileControlHelper, FormModule } from '@avalantec/base-app/form';

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
    FormModule,
  ],
  templateUrl: './general-information-section.html',
})
export class GeneralInformationSection {
  private fileHelper = inject(FormFileControlHelper);

  assetRoster = input.required<assetRoster | undefined>();

  // * DATA
  assetTypes = input<assetType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);

  isEditMode = input.required<boolean>();
  formService = inject(UpdateAssetRosterForm);

  form = this.formService.form;

  // Generate file state
  private fileState = this.fileHelper.generateMetadataFromFileControl(this.photoArray);
  uploadedFile = this.fileState.firstFile;

  get photoArray() {
    return this.form.controls.photo;
  }

  getTypeName(typeId: string) {
    return this.assetTypes().find(p => p._id === typeId)?.name;
  }
}
