import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { assetRoster, AssetRosterMaintenanceContext } from '../../../asset-roster';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import {
  CreateMaintenanceForm,
  CreateMaintenanceFormModel,
} from '../../services/create-maintenance-form';
import { CrudAssetMaintenances } from '../../services/crud-asset-maintenances';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-asset-maintenance-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    Text,
    Textarea,
    RadioButtonModule,
    FormModule,
    TranslatePipe,
  ],
  templateUrl: './asset-maintenance-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetMaintenanceFormDialog extends BaseDialog {
  // services
  protected formService = inject(CreateMaintenanceForm);
  private crudAssetMaintenance = inject(CrudAssetMaintenances);
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

  handleSubmit(data: FormValueState<CreateMaintenanceFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.crudAssetMaintenance
      .post({
        data: {
          assetRosterId: this.assetRoster()?._id,
          name: rawValue.name,
          description: rawValue.description || '',
          type: 'service',
          dateStart: new Date().toISOString(),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.assetRosterMaintenanceContext.handleService();
          this.toastManager.showSuccess('Service created successfully');
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
