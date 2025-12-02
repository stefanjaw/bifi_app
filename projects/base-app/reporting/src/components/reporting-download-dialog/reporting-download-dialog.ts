import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { CrudReporting } from '../../services/crud-reporting';
import { BaseDialog } from '@avalantec/base-app/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-reporting-download-dialog',
  imports: [FormsModule, DialogModule, SelectModule, FormModule, ButtonModule],
  templateUrl: './reporting-download-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingDownloadDialog extends BaseDialog {
  private crudReportings = inject(CrudReporting);

  // inputs
  model = input<string>('');

  // models
  selectedReporting = model('');

  // data
  reportingTemplatesResource = this.crudReportings.get({
    searchParams: { model: 'Product' },
    triggerRequest: this.dialogState,
  });

  reportingTemplates = this.reportingTemplatesResource.value;

  // state
  isLoading = this.reportingTemplatesResource.isLoading;
  isReportDownloadLoading = signal<boolean>(false);

  override openDialog(): void {
    this.selectedReporting.set('');
    super.openDialog();
  }

  async downloadReport() {
    this.isReportDownloadLoading.set(true);

    await this.crudReportings.downloadReport({
      reportId: this.selectedReporting(),
      getInactive: false,
    });

    this.isReportDownloadLoading.set(false);
    super.closeDialog();
  }
}
