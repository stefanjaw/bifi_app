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
import { CrudProductMaintenances, productMaintenance } from '../../../product-maintenances';
import { CrudProductCommissioning, productCommissionning } from '../../../product-commissioning';
import { ProductMaintenanceContext } from '../../services/product-maintenance-context';
import {
  ProductActivityHistoryAddFileForm,
  ProductActivityHistoryAddFileFormModel,
} from '../../services/product-activity-history-add-file-form';
import { BaseDialog } from '@avalantec/base-app/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'bifi-app-product-activity-history-add-file-dialog',
  imports: [DialogModule, ReactiveFormsModule, FileUploadModule, FormModule],
  templateUrl: './product-activity-history-add-file-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductActiviyHistoryAddFileDialog extends BaseDialog {
  // services
  private formService = inject(ProductActivityHistoryAddFileForm);
  private crudProductMaintenace = inject(CrudProductMaintenances);
  private crudProductCommissioning = inject(CrudProductCommissioning);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  form = this.formService.form;

  // inputs
  activityHistoryDocument = input.required<productCommissionning | productMaintenance | null>();

  header = computed(() => {
    const model = this.activityHistoryDocument();

    if (!model) return 'Add File';

    if ('name' in model) {
      return `Add File to Maintenance: ${model.name}`;
    } else {
      return `Add File to commissioning from equipment: ${model.productId.productModel}`;
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

  handleSubmit(data: FormValueState<ProductActivityHistoryAddFileFormModel>) {
    this.submitLoading.set(true);

    const { file } = data.rawValue;

    const model = this.activityHistoryDocument();

    if (!model || !file) {
      this.submitLoading.set(false);
      return;
    }

    // Decide which service to use based on the presence of 'name' property which only exists in productMaintenance
    const request =
      'name' in model
        ? this.crudProductMaintenace.put({
            _id: model._id,
            data: {
              attachments: file,
            },
          })
        : (this.crudProductCommissioning.put({
            _id: model._id,
            data: {
              attachments: file,
            },
          }) as Observable<any>);

    request.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.closeDialog();
        this.productMaintenanceContext.handleActivityHistoryAddFile();
      },
      error: () => {
        this.submitLoading.set(false);
      },
    });
  }
}
