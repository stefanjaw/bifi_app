import { Component, computed, effect, inject, OnDestroy, signal, viewChild } from '@angular/core';
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
import {
  ProductComissioningInitFormDialog,
  ProductDecomissioningFormDialog,
} from '../../../product-comissioning';
import { ProductMaintenanceContext } from '../../services/product-maintenance-context';
import { CrudProductMaintenances } from '../../../product-maintenances';

@Component({
  selector: 'bifi-app-product-maintenance',
  imports: [ProductEditForm, ProductComissioningInitFormDialog, ProductDecomissioningFormDialog],
  templateUrl: './product-maintenance.html',
})
export class ProductMaintenance implements OnDestroy {
  private formService = inject(UpdateProductForm);
  private productsService = inject(CrudProducts);
  private productTypesService = inject(CrudProductType);
  private contactsService = inject(CrudContacts);
  private roomsService = inject(CrudRooms);
  private maintenaceWindowsService = inject(CrudMaintenanceWindows);
  private productMaintenancesService = inject(CrudProductMaintenances);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastManager = inject(ToastManager);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  private destroy$ = new Subject<void>();

  // Coming in route as param
  id = computed(() => ({ _id: this.route.snapshot.paramMap.get('id') ?? '' }));
  products = this.productsService.get({ searchParams: this.id });

  // Data
  productTypes = this.productTypesService.get({});
  contacts = this.contactsService.get({});
  rooms = this.roomsService.get({});
  maintenaceWindows = this.maintenaceWindowsService.get({});

  // state
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

  // children
  comissioningInitFormDialog = viewChild<ProductComissioningInitFormDialog>(ProductComissioningInitFormDialog);
  decomissioningFormDialog = viewChild<ProductDecomissioningFormDialog>(ProductDecomissioningFormDialog);

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

    this.handleEvents();
  }

  /**
   * Called when the component is destroyed.
   * Unsubscribes from the {@link destroy$} subject to prevent memory leaks.
   */
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

    const productRequest = this.productsService.put({
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

    productRequest.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.isEditMode.set(false);
        this.handleReloadProduct();
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
  }

  /**
   * Opens the comissioning initialization dialog.
   *
   * This dialog is used to add a new comissioning record for the current product.
   * It is only accessible from the product maintenance page.
   */
  handleOpenComissionDialog() {
    this.comissioningInitFormDialog()?.openDialog();
  }

  /**
   * Opens the decomissioning dialog.
   *
   * This dialog is used to set the product status to 'decomissioned' and add a new
   * comissioning record with the outcome 'decomissioned'.
   * It is only accessible from the product maintenance page.
   */
  handleOpenDecomissionDialog() {
    this.decomissioningFormDialog()?.openDialog();
  }

  handleAddDocument() {
    console.log('Adding document');
  }

  handleFinishPM() {
    const PM = this.product()?.productMaintenances.find(m => m.type === 'preventive-maintenance');

    if (!PM) return;

    this.productMaintenancesService
      .put({
        _id: PM._id,
        data: {
          productId: this.product()?._id || '',
          name: 'PM',
          date: new Date().toISOString(),
          type: 'preventive-maintenance',
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleReloadProduct();
          this.toastManager.showSuccess('PM initiated successfully');
        },
      });
  }

  /**
   * Initiates a preventive maintenance record for the current product.
   *
   * This function adds a new record to the product maintenance collection with
   * the type 'preventive-maintenance'. The date is set to the current date and
   * time.
   *
   * After the record is added, the component reloads the product data and
   * shows a success toast message.
   */
  handleInitiatePM() {
    this.productMaintenancesService
      .post({
        data: {
          productId: this.product()?._id || '',
          name: 'PM',
          date: new Date().toISOString(),
          type: 'preventive-maintenance',
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleReloadProduct();
          this.toastManager.showSuccess('PM initiated successfully');
        },
      });
  }

  /**
   * Navigates back to the equipment list page.
   */
  handleBackToDashboard() {
    this.router.navigate(['asset-roaster', 'equipment', 'list']);
  }

  /**
   * Reloads the current product.
   *
   * This is useful when the product is edited outside of this component and the
   * changes need to be reflected in the component.
   */
  handleReloadProduct() {
    this.products.reload();
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

  /**
   * Subscribes to the handleEvents$ observable from the product maintenance context
   * and handles various product maintenance events.
   *
   * Executes different actions depending on the event type, such as toggling edit mode,
   * saving changes, canceling edits, managing commissioning and decommissioning processes,
   * handling document additions, finishing or initiating preventive maintenance, and navigating
   * back to the dashboard.
   */

  private handleEvents() {
    this.productMaintenanceContext.handleEvents$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      switch (event) {
        case 'toggle-edit':
          this.toggleEditMode();
          break;
        case 'save':
          this.handleSave();
          break;
        case 'cancel':
          this.handleCancel();
          break;
        case 'open-comission-dialog':
          this.handleOpenComissionDialog();
          break;
        case 'comission':
          this.handleReloadProduct();
          break;
        case 'open-decommission-dialog':
          this.handleOpenDecomissionDialog();
          break;
        case 'decommission':
          this.handleReloadProduct();
          break;
        case 'add-document':
          this.handleAddDocument();
          break;
        case 'finish-pm':
          this.handleFinishPM();
          break;
        case 'init-pm':
          this.handleInitiatePM();
          break;
        case 'back-to-dashboard':
          this.handleBackToDashboard();
          break;
      }
    });
  }
}
