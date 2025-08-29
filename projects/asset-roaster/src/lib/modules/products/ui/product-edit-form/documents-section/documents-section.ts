import { product } from '../../../interfaces/product';
import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProductMaintenanceContext } from '../../../services/product-maintenance-context';
import { FormModule, FormUploaderFile } from '@avalantec/base-app/form';
import { FileResolver } from '@avalantec/base-app/resource';
import { UpdateProductForm } from 'projects/asset-roaster/src/public-api';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [ButtonModule, CardModule, FormModule],
  templateUrl: './documents-section.html',
})
export class DocumentsSection {
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  private fileResolver = inject(FileResolver);
  private formService = inject(UpdateProductForm);

  isEditMode = input.required<boolean>();
  product = input.required<product | undefined>();
  attachmentsControl = this.formService.form.controls.attachments;

  handleAddDocument() {
    this.productMaintenanceContext.handleAddDocument();
  }

  downloadFile(attachment: FormUploaderFile) {
    this.fileResolver.downloadFileInBrowser({ file: attachment.file });
  }
}
