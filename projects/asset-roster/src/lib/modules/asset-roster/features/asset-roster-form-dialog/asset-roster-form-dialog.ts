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
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CrudAssetRoster } from '../../services/crud-asset-rosters';
import { CrudAssetType } from '../../../asset-types';
import {
  CreateAssetRosterForm,
  CreateAssetRosterFormModel,
} from '../../services/create-asset-roster-form';
import { AssetRosterMaintenanceContext } from '../../services/asset-roster-maintenance-context';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-asset-roster-form-dialog',
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    FormModule,
  ],
  templateUrl: './asset-roster-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterFormDialog extends BaseDialog {
  // Services
  protected formService = inject(CreateAssetRosterForm);
  private crudAssetType = inject(CrudAssetType);
  private crudAssetRoster = inject(CrudAssetRoster);
  private contactsService = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  // Data
  assetTypes = this.crudAssetType.get({ triggerRequest: this.dialogState });
  contacts = this.contactsService.get({ triggerRequest: this.dialogState });

  // State
  form = this.formService.form;
  isLoading = computed(() => this.assetTypes.isLoading() || this.contacts.isLoading());
  isSubmitLoading = signal(false);

  // Computed options
  assetTypeOptions = computed(() => {
    const types = this.assetTypes.value();
    return [
      {
        _id: undefined,
        name: 'Other',
      },
      ...types,
    ];
  });

  contactOptions = computed(() => {
    const contacts = this.contacts.value();
    return [
      {
        _id: undefined,
        name: 'Other',
      },
      ...contacts,
    ];
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

    this.crudAssetRoster
      .post({
        data: {
          productModel: rawValue.productModel,
          serialNumber: rawValue.serialNumber,
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
          ...(!this.isCreatingNewAssetType() && {
            assetTypeIds: [rawValue.assetTypeIds],
          }),
          ...(!this.isCreatingNewMake() && {
            makeIds: [rawValue.makeIds],
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
