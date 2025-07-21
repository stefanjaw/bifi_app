import { Component, inject, signal } from '@angular/core';
import { ProductEditForm } from '../../ui/product-edit-form/product-edit-form';
import { EquipmentForm } from '@avalantec/asset-roaster/modules/products/services/equipment-form';

@Component({
  selector: 'bifi-app-product-maintenance',
  imports: [ProductEditForm],
  providers: [EquipmentForm],
  templateUrl: './product-maintenance.html',
})
export class ProductMaintenance {
  private formService = inject(EquipmentForm);

  isEditMode = signal(false);

  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
  }

  handleSave() {
    const state = this.formService.getValueState();
    console.log('Saving equipment:', state.rawValue);
    this.isEditMode.set(false);
  }

  handleCancel() {
    this.formService.reset();
    this.isEditMode.set(false);
  }

  handleBackToDashboard() {
    console.log('Navigating back to dashboard');
  }

  handleCommission() {
    console.log('Commissioning equipment');
  }

  handleAddDocument() {
    console.log('Adding document');
  }
}
