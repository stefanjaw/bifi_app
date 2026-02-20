import { Component, computed, DestroyRef, inject, input, model, signal } from '@angular/core';
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
import { CrudFacilities, CrudRooms, facility, room } from '../../../../facilities';
import { FormFileControlHelper, FormModule } from '@avalantec/base-app/form';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private crudVendorContacts = inject(CrudContacts);
  private crudRooms = inject(CrudRooms);
  private destroy$ = inject(DestroyRef);
  private crudFacilities = inject(CrudFacilities);
  assetRoster = input.required<assetRoster | undefined>();

  //RESOURCES
  vendorsResource = this.crudVendorContacts.get({});
  roomsResources = this.crudRooms.get({});
  facilitiesResource = this.crudFacilities.get({});

  //VARIABLES
  vendorName = model('');
  vendorLastName = model('');
  vendorEmail = model('');
  vendorPhone = model('');

  roomName = model('');

  // * DATA
  assetTypes = input<assetType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);

  // * OPTIONS
  vendorsOptions = computed(() => this.vendorsResource.value() ?? []);
  roomOptions = computed(() => this.roomsResources.value() ?? []);
  facilityOptions = computed(() => this.facilitiesResource.value() ?? []);

  isEditMode = input.required<boolean>();
  formService = inject(UpdateAssetRosterForm);
  showVendorForm = signal(false);
  showRoomForm = signal(false);

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
  handleVendorCreation() {
    this.crudVendorContacts
      .post({
        data: {
          name: this.vendorName(),
          lastName: ' ',
          email: this.vendorEmail(),
          phoneNumber: 'Phone not provided',
          type: 'individual',
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: createdVendor => {
          if (!createdVendor) return;

          this.vendorsResource.reload();

          this.form.controls.vendorIds.setValue(createdVendor._id);

          this.vendorName.set('');
          this.vendorEmail.set('');
          this.showVendorForm.set(false);
        },
      });
  }

  handleRoomCreation() {
    this.crudRooms
      .post({
        data: { name: this.roomName(), facilityId: this.form.controls.facilityId.value, code: ' ', address: ' ' },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.roomsResources.reload();
          this.roomName.set('');
          this.facilitiesResource.reload();
          this.showRoomForm.set(false);
        },
      });
  }
  toggleVendorForm() {
    this.showVendorForm.update(v => !v);
  }
  toggleRoomForm() {
    this.showRoomForm.update(v => !v);
  }
}
