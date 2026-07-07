import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { BaseDialog, Text } from '@avalantec/base-app/core';
import {
  SkipMaintenanceForm,
  SkipMaintenanceFormModel,
} from '../../services/skip-maintenance-form';
import { CrudAssetRoster, assetRoster, AssetRosterMaintenanceContext } from '../../../asset-roster';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { TextareaModule } from 'primeng/textarea';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-asset-skip-maintenance-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FormModule,
    TextareaModule,
    CommonModule,
    Text,
    TranslatePipe,
  ],
  templateUrl: './asset-skip-maintenance-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetSkipMaintenanceFormDialog extends BaseDialog {
  // services
  private formService = inject(SkipMaintenanceForm);
  private crudAssetRoster = inject(CrudAssetRoster);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  form = this.formService.form;

  // inputs
  assetRoster = input.required<assetRoster | undefined>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);

  override openDialog(): void {
    this.formService.reset();
    this.formService.form.markAsTouched();
    this.formService.form.markAsDirty();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<SkipMaintenanceFormModel>) {
    this.submitLoading.set(true);

    this.crudAssetRoster
      .put({
        _id: this.assetRoster()?._id || '',
        data: data.rawValue,
        specificEndpoint: 'skip-pm',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.assetRosterMaintenanceContext.handleSkipPM();
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
