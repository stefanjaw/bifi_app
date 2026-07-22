import { AssetRosterMaintenanceContext } from '../../../asset-roster';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  CreateCommissioningForm,
  CreateCommissioningFormModel,
} from '../../services/create-commissioning-form';
import { DialogModule } from 'primeng/dialog';
import { assetRoster } from '../../../asset-roster';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';
import { CrudAssetCommissioning } from '../../services/crud-asset-commissioning';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileUploadModule } from 'primeng/fileupload';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-asset-commissioning-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    Text,
    RadioButtonModule,
    Textarea,
    FileUploadModule,
    FormModule,
    TranslatePipe,
  ],
  templateUrl: './asset-commissioning-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetCommissioningFormDialog extends BaseDialog {
  // services
  protected formService = inject(CreateCommissioningForm);
  private crudAssetCommissioning = inject(CrudAssetCommissioning);
  private toastManager = inject(ToastManager);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
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

  handleSubmit(data: FormValueState<CreateCommissioningFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.crudAssetCommissioning
      .post({
        data: {
          assetRosterId: this.assetRoster()?._id,
          outcome: rawValue.outcome,
          details: rawValue.details || '',
          ...(rawValue.attachments && { attachments: rawValue.attachments }),
        },
        notificationConfig: { enable: false },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.assetRosterMaintenanceContext.handleCommission();
          this.toastManager.showSuccess('commissioning created successfully');
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
