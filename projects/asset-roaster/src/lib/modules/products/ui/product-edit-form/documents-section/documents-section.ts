import { Component, inject, input } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProductMaintenanceContext } from '../../../services/product-maintenance-context';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [...AppFormExtensionsImports, ButtonModule, CardModule],
  templateUrl: './documents-section.html',
})
export class DocumentsSection {
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  isEditMode = input.required<boolean>();

  handleAddDocument() {
    this.productMaintenanceContext.handleAddDocument();
  }
}
