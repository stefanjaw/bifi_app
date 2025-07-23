import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudProducts } from '../../services/crud-products';
import { UpdateProductForm } from '../../services/update-product-form';
import { ProductEditForm } from '../../ui/product-edit-form/product-edit-form';

@Component({
  selector: 'bifi-app-product-maintenance',
  imports: [ProductEditForm],
  templateUrl: './product-maintenance.html',
})
export class ProductMaintenance {
  private formService = inject(UpdateProductForm);
  private productsService = inject(CrudProducts);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Coming in route as param
  id = computed(() => ({ _id: this.route.snapshot.paramMap.get('id') ?? '' }));
  product = this.productsService.get({ searchParams: this.id });

  // State
  isEditMode = signal(false);

  constructor() {
    effect(() => {
      const value = this.product.value()?.[0];
      const isLoading = this.product.isLoading();

      if (isLoading || !value) {
        return;
      }

      this.formService.patchValue({
        condition: value.condition,
        currentPrice: value.currentPrice,
        acquiredDate: value.acquiredDate,
        locationId: value.locationId?._id || '',
        productModel: value.productModel,
        acquiredPrice: value.acquiredPrice,
        maintenanceWindowIds: value.maintenanceWindowIds?.[0]?._id || '',
        makeIds: value.makeIds?.[0]?._id || '',
        vendorIds: value.vendorIds?.[0]?._id || '',
        serialNumber: value.serialNumber,
        productTypeIds: value.productTypeIds?.[0]?.name || '',
        remarks: value.remarks,
        warrantyDate: value.warrantyDate,
      });
    });
  }

  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
  }

  handleSave() {
    this.isEditMode.set(false);
  }

  handleCancel() {
    this.formService.reset();
    this.isEditMode.set(false);
  }

  handleBackToDashboard() {
    this.router.navigate(['asset-roaster', 'equipment', 'list']);
  }

  handleCommission() {
    console.log('Commissioning equipment');
  }

  handleAddDocument() {
    console.log('Adding document');
  }
}
