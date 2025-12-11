import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, Text } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import {
  UpdateMaintenanceForm,
  UpdateMaintenanceFormModel,
} from '../../services/update-maintenance-form';
import { CrudAssetMaintenances } from '../../services/crud-asset-maintenances';
import { assetRoster, AssetRosterMaintenanceContext } from '../../../asset-roster';
import { assetMaintenance } from '../../interfaces/asset-maintenance';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'bifi-app-asset-finish-maintenance-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FileUploadModule,
    Text,
    CommonModule,
    FormModule,
    TextareaModule,
  ],
  templateUrl: './asset-finish-maintenance-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetFinishMaintenanceFormDialog extends BaseDialog {
  // services
  protected formService = inject(UpdateMaintenanceForm);
  private crudAssetMaintenance = inject(CrudAssetMaintenances);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  form = this.formService.form;

  // inputs
  assetRoster = input.required<assetRoster | undefined>();
  maintenanceType = input.required<assetMaintenance['type']>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);
  assetMaintenace = computed(() =>
    this.assetRoster()?.assetMaintenances.find(m => m.type === this.maintenanceType())
  );

  override openDialog(): void {
    this.formService.reset();
    this.formService.form.markAsTouched();
    this.formService.form.markAsDirty();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<UpdateMaintenanceFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.crudAssetMaintenance
      .put({
        _id: this.assetMaintenace()?._id || '',
        data: {
          attachments: rawValue.attachments,
          active: 'false',
          notes: rawValue.notes,
          dateEnd: new Date().toISOString(),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();

          if (this.maintenanceType() === 'service') {
            this.assetRosterMaintenanceContext.handleFinishService();
          } else {
            this.assetRosterMaintenanceContext.handleFinishPM();
          }
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
