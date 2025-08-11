import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProductMaintenanceContext } from '../../../services/product-maintenance-context';
import { FormSection } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [ButtonModule, CardModule, FormSection],
  templateUrl: './documents-section.html',
})
export class DocumentsSection {
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  isEditMode = input.required<boolean>();

  handleAddDocument() {
    this.productMaintenanceContext.handleAddDocument();
  }
}
