import { assetRoster } from '../../../interfaces/asset-roster';
import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { FormModule, FormUploaderFile } from '@avalantec/base-app/form';
import { FileResolver } from '@avalantec/base-app/resource';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [ButtonModule, CardModule, FormModule],
  templateUrl: './documents-section.html',
})
export class DocumentsSection {
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  private fileResolver = inject(FileResolver);
  private formService = inject(UpdateAssetRosterForm);

  isEditMode = input.required<boolean>();
  assetRoster = input.required<assetRoster | undefined>();
  attachmentsControl = this.formService.form.controls.attachments;

  handleAddDocument() {
    this.assetRosterMaintenanceContext.handleAddDocument();
  }

  downloadFile(attachment: FormUploaderFile) {
    this.fileResolver.downloadFileInBrowser({ file: attachment.file });
  }
}
