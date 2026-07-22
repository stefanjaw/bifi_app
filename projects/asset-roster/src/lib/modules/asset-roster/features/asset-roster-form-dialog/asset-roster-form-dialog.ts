import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CrudAssetRoster } from '../../services/crud-asset-rosters';
import { CrudAssetType } from '../../../asset-types';
import {
  CreateAssetRosterForm,
  CreateAssetRosterFormModel,
} from '../../services/create-asset-roster-form';
import { AssetRosterMaintenanceContext } from '../../services/asset-roster-maintenance-context';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { t, TranslatePipe } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-asset-roster-form-dialog',
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    DialogModule,
    RadioButtonModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    ToggleSwitchModule,
    FormModule,
    TranslatePipe,
  ],
  templateUrl: './asset-roster-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterFormDialog extends BaseDialog {
  protected formService = inject(CreateAssetRosterForm);
  private crudAssetType = inject(CrudAssetType);
  private crudAssetRoster = inject(CrudAssetRoster);
  private contactsService = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  assetTypes = this.crudAssetType.get({ triggerRequest: this.dialogState });
  contacts = this.contactsService.get({ triggerRequest: this.dialogState });
  assetRosters = this.crudAssetRoster.get({ triggerRequest: this.dialogState });

  form = this.formService.form;
  deviceType = this.formService.deviceType;
  isLoading = computed(() => this.assetTypes.isLoading() || this.contacts.isLoading());

  assetRosterOptions = computed(() =>
    (this.assetRosters.value() ?? []).map(ar => ({
      _id: ar._id,
      label:
        ar.serialNumber || ar.productModel || ar.description || t('unnamed', {}, 'asset-roster'),
    }))
  );
  isSubmitLoading = signal(false);

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

  assetTypeOptions = computed(() => {
    const types = this.assetTypes.value();
    return [{ _id: undefined, name: 'Other' }, ...types];
  });

  contactOptions = computed(() => {
    const contacts = this.contacts.value();
    return [{ _id: undefined, name: 'Other' }, ...contacts];
  });

  get typeIdControl() {
    return this.form.controls.assetTypeIds;
  }

  get makeIdControl() {
    return this.form.controls.makeIds;
  }

  isCreatingNewAssetType() {
    return this.typeIdControl.touched && this.typeIdControl.value === undefined;
  }

  isCreatingNewMake() {
    return this.makeIdControl.touched && this.makeIdControl.value === undefined;
  }

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  async handleSubmit(data: FormValueState<CreateAssetRosterFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;
    const dt = rawValue.deviceType;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.crudAssetRoster
      .post({
        data: {
          deviceType: dt,
          acquiredDate: rawValue.acquiredDate.toISOString(),
          ...(this.isCreatingNewAssetType() && {
            assetTypeInformation: {
              name: rawValue.createdType.name!,
              description: rawValue.createdType.description!,
            },
          }),
          ...(this.isCreatingNewMake() && {
            makeInformation: {
              name: rawValue.createdMake.oemName!,
              lastName: rawValue.createdMake.oemName!,
              type: 'company',
              website: 'www.example.com',
            },
          }),
          ...(!this.isCreatingNewAssetType() &&
            rawValue.assetTypeIds && {
              assetTypeIds: [rawValue.assetTypeIds],
            }),
          ...(!this.isCreatingNewMake() &&
            rawValue.makeIds && {
              makeIds: [rawValue.makeIds],
            }),
          ...(dt === 'serialized' && {
            serialNumber: rawValue.serialNumber,
            productModel: rawValue.productModel,
          }),
          ...(dt === 'non-serialized' && {
            description: rawValue.description,
            ...(rawValue.quantity != null && { quantity: rawValue.quantity }),
          }),
          ...(dt === 'software' && {
            description: rawValue.description,
            softwareConfiguration: {
              regulatoryClassification: rawValue.softwareConfiguration.regulatoryClassification,
              version: rawValue.softwareConfiguration.version,
              licenseType: rawValue.softwareConfiguration.licenseType,
              preventAutoUpdate: rawValue.softwareConfiguration.preventAutoUpdate ?? false,
              ...(rawValue.softwareConfiguration.parentAssetId && {
                parentAssetId: rawValue.softwareConfiguration.parentAssetId,
              }),
              ...(rawValue.softwareConfiguration.udiDi && {
                udiDi: rawValue.softwareConfiguration.udiDi,
              }),
              ...(rawValue.softwareConfiguration.fdaMdrClass && {
                fdaMdrClass: rawValue.softwareConfiguration.fdaMdrClass,
              }),
              ...(rawValue.softwareConfiguration.licenseKey && {
                licenseKey: rawValue.softwareConfiguration.licenseKey,
              }),
            },
          }),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.assetRosterMaintenanceContext.handleSaved();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
