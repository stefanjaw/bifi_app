import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { assetRoster, AssetRosterMaintenanceContext } from '../../../asset-roster';
import { CrudAssetCommissioning } from '../../services/crud-asset-commissioning';
import {
  UpdateDecommissioningForm,
  UpdateDecommissioningFormModel,
} from '../../services/update-decommissioning-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-asset-decommissioning-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, Text, Textarea, FormModule],
  templateUrl: './asset-decommissioning-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetDecommissioningFormDialog extends BaseDialog {
  // services
  private formService = inject(UpdateDecommissioningForm);
  private crudAssetCommissioning = inject(CrudAssetCommissioning);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  private toastManager = inject(ToastManager);
  form = this.formService.form;

  // inputs
  assetRoster = input.required<assetRoster | undefined>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<UpdateDecommissioningFormModel>) {
    this.submitLoading.set(true);

    this.crudAssetCommissioning
      .put({
        _id: this.assetRoster()?.assetCommission?._id || '',
        data: {
          details: data.rawValue.details || '',
        },
        specificEndpoint: 'decommission',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.assetRosterMaintenanceContext.handleDecommission();
          this.toastManager.showSuccess('Decommissioned successfully');
          this.closeDialog();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
