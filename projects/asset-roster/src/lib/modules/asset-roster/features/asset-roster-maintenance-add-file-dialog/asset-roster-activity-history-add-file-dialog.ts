import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CrudAssetMaintenances, assetMaintenance } from '../../../asset-maintenances';
import { CrudAssetCommissioning, assetCommissionning } from '../../../asset-commissioning';
import { AssetRosterMaintenanceContext } from '../../services/asset-roster-maintenance-context';
import {
  AssetRosterActivityHistoryAddFileForm,
  AssetRosterActivityHistoryAddFileFormModel,
} from '../../services/asset-roster-activity-history-add-file-form';
import { BaseDialog } from '@avalantec/base-app/core';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'bifi-app-asset-roster-activity-history-add-file-dialog',
  imports: [DialogModule, ReactiveFormsModule, FileUploadModule, FormModule, TranslatePipe],
  templateUrl: './asset-roster-activity-history-add-file-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterActiviyHistoryAddFileDialog extends BaseDialog {
  // services
  private formService = inject(AssetRosterActivityHistoryAddFileForm);
  private crudAssetMaintenace = inject(CrudAssetMaintenances);
  private crudAssetCommissioning = inject(CrudAssetCommissioning);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  private translationService = inject(TranslationService);
  form = this.formService.form;

  // inputs
  activityHistoryDocument = input.required<assetCommissionning | assetMaintenance | null>();

  header = computed(() => {
    const model = this.activityHistoryDocument();

    if (!model) return this.translationService.translate('addFile', {}, 'asset-roster');

    if ('name' in model) {
      return this.translationService.translate(
        'addFileToMaintenance',
        { name: model.name },
        'asset-roster'
      );
    } else {
      return this.translationService.translate(
        'addFileToCommissioning',
        { model: model.assetRosterId.productModel },
        'asset-roster'
      );
    }
  });

  // state
  submitLoading = signal(false);
  private destroy$ = inject(DestroyRef);
  private fileUpload = viewChild<FileUpload>('fileUpload');

  override openDialog(): void {
    this.fileUpload()?.clear();
    this.formService.reset();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<AssetRosterActivityHistoryAddFileFormModel>) {
    this.submitLoading.set(true);

    const { file } = data.rawValue;

    const model = this.activityHistoryDocument();

    if (!model || !file) {
      this.submitLoading.set(false);
      return;
    }

    // Decide which service to use based on the presence of 'name' property which only exists in assetMaintenance
    const request =
      'name' in model
        ? this.crudAssetMaintenace.put({
            _id: model._id,
            data: {
              attachments: file,
            },
          })
        : (this.crudAssetCommissioning.put({
            _id: model._id,
            data: {
              attachments: file,
            },
          }) as Observable<any>);

    request.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.closeDialog();
        this.assetRosterMaintenanceContext.handleActivityHistoryAddFile();
      },
      error: () => {
        this.submitLoading.set(false);
      },
    });
  }
}
