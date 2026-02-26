import { assetRoster } from '../../../interfaces/asset-roster';
import { Component, inject, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AssetRosterMaintenanceContext } from '../../../services/asset-roster-maintenance-context';
import { FormModule, FormUploaderFile } from '@avalantec/base-app/form';
import { FileResolver } from '@avalantec/base-app/resource';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { TextareaModule } from 'primeng/textarea';
import { CrudAssetRoster } from '../../../services/crud-asset-rosters';
import { MessageModule } from 'primeng/message';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [
    ButtonModule,
    CardModule,
    FormModule,
    TextareaModule,
    MessageModule,
    ReactiveFormsModule,
  ],
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
  questionControl = this.formService.form.controls.aiquestion;
  form = this.formService.form;

  aiResponse = signal<any | null>(null);
  isLoading = signal(false);

  handleAddDocument() {
    this.assetRosterMaintenanceContext.handleAddDocument();
  }

  handleRemoveDocument(index: number) {
    this.attachmentsControl.removeAt(index);
  }
  downloadFile(attachment: FormUploaderFile) {
    this.fileResolver.downloadFileInBrowser({ file: attachment.file });
  }

  submitAskGenai() {
    const attachments = this.attachmentsControl.getRawValue();
    console.log('Question', this.formService.form.controls.aiquestion.value?.trim());
    console.log('attachments', attachments);
    if (!attachments?.length) return;

    this.isLoading.set(true);

    this.crudAssetRoster
      .readDocuments(attachments as FormUploaderFile[], this.form.controls.aiquestion.value?.trim())
      .subscribe({
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
