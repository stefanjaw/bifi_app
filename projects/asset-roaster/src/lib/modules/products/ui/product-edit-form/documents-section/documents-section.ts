import { product } from '../../../interfaces/product';
import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProductMaintenanceContext } from '../../../services/product-maintenance-context';
import { FormModule } from '@avalantec/base-app/form';
import { FileResolver } from '@avalantec/base-app/resource';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [ButtonModule, CardModule, FormModule],
  templateUrl: './documents-section.html',
})
export class DocumentsSection {
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  private fileResolver = inject(FileResolver);

  isEditMode = input.required<boolean>();
  product = input.required<product | null>();

  handleAddDocument() {
    this.productMaintenanceContext.handleAddDocument();
  }

  downloadFile(fileId: string) {
    this.fileResolver.downloadFileInBrowser({
      id: fileId,
    });
  }
}
