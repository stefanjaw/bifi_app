import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { product } from '../../../interfaces/product';
import { ProductMaintenanceContext } from '../../../services/product-maintenance-context';
import { FormSection } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-commissioning-lifecycle-section',
  imports: [ButtonModule, CardModule, FormSection],
  templateUrl: './commissioning-lifecycle-section.html',
})
export class CommissioningLifecycleSection {
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  product = input.required<product | null>();
  isEditMode = input.required<boolean>();

  handleOpenComissionDialog() {
    this.productMaintenanceContext.handleOpenComissionDialog();
  }

  handleOpenDecomissionDialog() {
    this.productMaintenanceContext.handleOpenDecomissionDialog();
  }
}
