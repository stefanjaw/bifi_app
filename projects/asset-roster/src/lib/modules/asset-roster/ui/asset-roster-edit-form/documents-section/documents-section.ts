import { assetRoster } from '../../../interfaces/asset-roster';
import { Component, inject, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { FormModule, FormUploaderFile } from '@avalantec/base-app/form';
import { FileResolver } from '@avalantec/base-app/resource';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { TextareaModule } from 'primeng/textarea';
import { CrudAssetRoster } from 'projects/asset-roster/src/public-api';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [ButtonModule, CardModule, FormModule, TextareaModule],
  templateUrl: './documents-section.html',
})
export class DocumentsSection {
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  private fileResolver = inject(FileResolver);
  private crudAssetRoster = inject(CrudAssetRoster);
  private formService = inject(UpdateAssetRosterForm);

  isEditMode = input.required<boolean>();
  assetRoster = input.required<assetRoster | undefined>();
  attachmentsControl = this.formService.form.controls.attachments;

  question = signal('');
  aiResponse = signal<any | null>(null);
  isLoading = signal(false);

  handleAddDocument() {
    this.assetRosterMaintenanceContext.handleAddDocument();
  }

  downloadFile(attachment: FormUploaderFile) {
    this.fileResolver.downloadFileInBrowser({ file: attachment.file });
  }

  submitAskGenai() {
    const attachments = this.attachmentsControl.getRawValue();
    console.log('attachments', attachments);
    if (!attachments?.length) return;

    this.isLoading.set(true);

    this.crudAssetRoster.readDocuments(attachments as FormUploaderFile[], this.question()).subscribe({
      next: response => {
        this.aiResponse.set(response);
        this.isLoading.set(false);
      },
      error: err => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
