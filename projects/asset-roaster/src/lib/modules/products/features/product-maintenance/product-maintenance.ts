import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudProducts } from '../../services/crud-products';
import { UpdateProductForm } from '../../services/update-product-form';
import { ProductEditForm } from '../../ui/product-edit-form/product-edit-form';
import { product } from '../../interfaces/product';
import { CrudProductType } from '../../../product-types';
import { CrudRooms } from '../../../facilities';
import { CrudContacts } from '@avalantec/base-app/settings';
import { CrudMaintenanceWindows } from '../../../maintenance-windows';
import { ToastManager } from '@avalantec/base-app/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'bifi-app-product-maintenance',
  imports: [ProductEditForm],
  templateUrl: './product-maintenance.html',
})
export class ProductMaintenance implements OnDestroy {
  private formService = inject(UpdateProductForm);
  private productsService = inject(CrudProducts);
  private productTypesService = inject(CrudProductType);
  private contactsService = inject(CrudContacts);
  private roomsService = inject(CrudRooms);
  private maintenaceWindowsService = inject(CrudMaintenanceWindows);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastManager = inject(ToastManager);
  private destroy$ = new Subject<void>();

  // Coming in route as param
  id = computed(() => ({ _id: this.route.snapshot.paramMap.get('id') ?? '' }));
  products = this.productsService.get({ searchParams: this.id });

  // Data
  productTypes = this.productTypesService.get({});
  contacts = this.contactsService.get({});
  rooms = this.roomsService.get({});
  maintenaceWindows = this.maintenaceWindowsService.get({});

  loading = computed(() => {
    return (
      this.products.isLoading() ||
      this.productTypes.isLoading() ||
      this.contacts.isLoading() ||
      this.rooms.isLoading() ||
      this.maintenaceWindows.isLoading()
    );
  });

  submitLoading = signal(false);

  // get first product and store it
  product = computed(() => {
    if (
      this.products.isLoading() ||
      !this.products.hasValue() ||
      this.products.value().length === 0
    )
      return null;

    return this.products.value()[0];
  });

  // State
  isEditMode = signal(false);

  /**
   * This effect is used to set the form values to the initial state from the `product` signal.
   * This is needed because the `product` signal is used to fetch the product data and the form
   * must be initialized with the fetched data.
   * The effect is run every time the `product` signal changes.
   */
  constructor() {
    effect(() => {
      const product = this.product();

      // set new values as initial state
      this.resetValueToInitialState(product);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  /**
   * Toggles the edit mode state of the component.
   * When invoked, it switches the `isEditMode` signal
   * between true and false.
   */
  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
  }

  /**
   * Saves the form values to the server.
   * It fetches the product data again after the save is finished.
   * The `isEditMode` state is set to false after the save.
   * The `submitLoading` signal is set to true while the save is in progress.
   */
  handleSave() {
    const value = this.formService.dirtyValue();

    this.submitLoading.set(true);

    const productResource = this.productsService.put({
      _id: this.product()?._id || '',
      data: {
        ...value,
        ...(value.productTypeIds && {
          productTypeIds: [value.productTypeIds],
        }),
        ...(value.makeIds && {
          makeIds: [value.makeIds],
        }),
        ...(value.vendorIds && {
          vendorIds: [value.vendorIds],
        }),
        ...(value.maintenanceWindowIds && {
          maintenanceWindowIds: [value.maintenanceWindowIds],
        }),
        ...(value.acquiredDate && {
          acquiredDate: value.acquiredDate.toISOString(),
        }),
        ...(value.warrantyDate && {
          warrantyDate: value.warrantyDate.toISOString(),
        }),
        ...(value.maintenanceDate && {
          maintenanceDate: value.maintenanceDate.toISOString(),
        }),
      },
    });

    productResource.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.isEditMode.set(false);
        this.products.reload();
        this.toastManager.showSuccess('Product updated successfully');
      },
      error: () => {
        this.submitLoading.set(false);
      },
    });
  }

  /**
   * Cancel any changes made to the form and reset the form back to it's initial state.
   * Additionally, set `isEditMode` to false.
   */
  handleCancel() {
    this.resetValueToInitialState(this.product());
    this.isEditMode.set(false);
    console.log('Canceling changes');
  }

  /**
   * Navigates back to the equipment list page.
   */
  handleBackToDashboard() {
    this.router.navigate(['asset-roaster', 'equipment', 'list']);
  }

  handleInitiatePM() {
    console.log('Initiating PM');
  }

  handleFinishPM() {
    console.log('Finishing PM');
  }

  handleCommission() {
    console.log('Commissioning equipment');
  }

  handleDecommission() {
    console.log('Decomissioning equipment');
  }

  handleAddDocument() {
    console.log('Adding document');
  }

  /**
   * Resets the form values to the current state of the product.
   *
   * If `data` is not provided, the form will be reset to its pristine state.
   *
   * @param product The current state of the product.
   */
  private resetValueToInitialState(product: product | null) {
    if (!product) {
      this.formService.reset();
      return;
    }

    this.formService.patchValue({
      condition: product.condition,
      currentPrice: product.currentPrice,
      acquiredDate: product.acquiredDate ? new Date(product.acquiredDate) : null,
      locationId: product.locationId?._id || '',
      productModel: product.productModel,
      acquiredPrice: product.acquiredPrice,
      maintenanceWindowIds: product.maintenanceWindowIds?.[0]?._id || '',
      maintenanceDate: product.maintenanceDate ? new Date(product.maintenanceDate) : null,
      makeIds: product.makeIds?.[0]?._id || '',
      vendorIds: product.vendorIds?.[0]?._id || '',
      serialNumber: product.serialNumber,
      productTypeIds: product.productTypeIds?.[0]?._id || '',
      remarks: product.remarks,
      warrantyDate: product.warrantyDate ? new Date(product.warrantyDate) : null,
    });

    this.formService.form.markAsPristine();
    this.formService.form.markAsUntouched();
  }
}
