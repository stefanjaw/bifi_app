import { Component, computed, inject, input, model, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { assetRoster } from '../../../interfaces/asset-roster';
import { assetType } from '../../../../asset-types';
import { contact } from '@avalantec/base-app/interfaces';
import { CrudFacilities, CrudRooms, room } from '../../../../facilities';
import { FormFileControlHelper, FormModule } from '@avalantec/base-app/form';
import { t, TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudAssetRoster } from '../../../services/crud-asset-rosters';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'bifi-app-general-information-section',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    FileUploadModule,
    CardModule,
    CommonModule,
    SelectModule,
    TagModule,
    ToggleSwitchModule,
    FormModule,
    TranslatePipe,
  ],
  templateUrl: './general-information-section.html',
})
export class GeneralInformationSection {
  private fileHelper = inject(FormFileControlHelper);
  private crudVendorContacts = inject(CrudContacts);
  private crudRooms = inject(CrudRooms);
  private crudAssetRoster = inject(CrudAssetRoster);
  private crudFacilities = inject(CrudFacilities);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  assetRoster = input.required<assetRoster | undefined>();

  vendorsResource = this.crudVendorContacts.get({});
  roomsResources = this.crudRooms.get({});
  facilitiesResource = this.crudFacilities.get({});
  assetRosters = this.crudAssetRoster.get({});

  vendorName = model('');
  vendorLastName = model('');
  vendorEmail = model('');
  vendorPhone = model('');
  roomName = model('');

  assetTypes = input<assetType[]>([]);
  contacts = input<contact[]>([]);
  rooms = input<room[]>([]);

  vendorsOptions = computed(() => this.vendorsResource.value() ?? []);
  roomOptions = computed(() => this.roomsResources.value() ?? []);
  facilityOptions = computed(() => this.facilitiesResource.value() ?? []);
  assetRosterOptions = computed(() =>
    (this.assetRosters.value() ?? []).map(ar => ({
      _id: ar._id,
      label:
        ar.serialNumber || ar.productModel || ar.description || t('unnamed', {}, 'asset-roster'),
    }))
  );

  isEditMode = input.required<boolean>();
  formService = inject(UpdateAssetRosterForm);
  newLocationNameForAssignment = model('');
  newFacilityIdForAssignment = model<string | null>(null);
  form = this.formService.form;

  deviceType = toSignal(
    this.form.controls.deviceType.valueChanges.pipe(startWith(this.form.controls.deviceType.value))
  );

  totalQuantity = toSignal(
    this.form.controls.quantity.valueChanges.pipe(startWith(this.form.controls.quantity.value))
  );

  totalAssigned = toSignal(
    this.form.controls.locationAssignments.valueChanges.pipe(
      startWith(this.form.controls.locationAssignments.value),
      map(rows => rows.reduce((sum: number, r: any) => sum + (r.assignedQuantity ?? 0), 0))
    ),
    { initialValue: 0 }
  );

  totalUnassigned = computed(() => (this.totalQuantity() ?? 0) - this.totalAssigned());

  selectedLocationIds = toSignal(
    this.form.controls.locationAssignments.valueChanges.pipe(
      startWith(this.form.controls.locationAssignments.value),
      map(rows => rows.map((r: any) => r.locationId).filter(Boolean))
    ),
    { initialValue: [] as string[] }
  );

  getAvailableRoomOptions(currentIndex: number) {
    const ownId = this.locationAssignmentsControls[currentIndex]?.value?.locationId;
    const selected = this.selectedLocationIds();
    return this.roomOptions().filter(r => r._id === ownId || !selected.includes(r._id));
  }

  get locationAssignmentsControls() {
    return this.form.controls.locationAssignments.controls;
  }

  regulatoryClassificationOptions = signal([
    { label: 'OS / Middleware', value: 'os-middleware' },
    { label: 'SiMD – Software in a Medical Device', value: 'simd' },
    { label: 'SaMD – Software as a Medical Device', value: 'samd' },
  ]);

  fdaMdrClassOptions = signal([
    { label: 'Class I', value: 'class-i' },
    { label: 'Class II', value: 'class-ii' },
    { label: 'Class III', value: 'class-iii' },
  ]);

  licenseTypeOptions = signal([
    { label: 'Perpetual', value: 'perpetual' },
    { label: 'Subscription SaaS', value: 'subscription-saas' },
  ]);

  deviceTypeLabel = computed(() => {
    const dt = this.deviceType();
    if (dt === 'non-serialized') return 'Non-Serialized';
    if (dt === 'software') return 'Software';
    return 'Serialized';
  });

  private fileState = this.fileHelper.generateMetadataFromFileControl(this.photoArray);
  uploadedFile = this.fileState.firstFile;

  get photoArray() {
    return this.form.controls.photo;
  }

  getTypeName(typeId: string) {
    return this.assetTypes().find(p => p._id === typeId)?.name;
  }

  getParentAssetLabel(id: string | null, fallback: string): string {
    if (!id) return fallback;
    return this.assetRosterOptions().find(o => o._id === id)?.label ?? fallback;
  }

  addLocation() {
    this.formService.addLocationAssignment();
  }

  removeLocation(index: number) {
    this.formService.removeLocationAssignment(index);
  }

  openPhotoDialog() {
    this.assetRosterMaintenanceContext.handleOpenPhotoDialog();
  }
}
