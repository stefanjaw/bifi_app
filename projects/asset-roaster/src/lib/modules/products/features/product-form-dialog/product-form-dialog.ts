import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, ToastManager } from '@avalantec/base-app/core';
import { AppFormExtensionsImports, FormValueState } from '@avalantec/base-app/form';
import { contact, CrudContacts } from '@avalantec/base-app/settings';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { CrudProducts } from '../../services/crud-products';
import { CrudProductType, productType } from '../../../product-types';
import { CreateProductForm, CreateProductFormModel } from '../../services/create-product-form';
import { ProductMaintenanceContext } from '../../services/product-maintenance-context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-product-form-dialog',
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    DialogModule,
    AppFormExtensionsImports,
    SelectModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './product-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormDialog extends BaseDialog {
  // Services
  protected formService = inject(CreateProductForm);
  private productTypesService = inject(CrudProductType);
  private productsService = inject(CrudProducts);
  private contactsService = inject(CrudContacts);
  private toastManager = inject(ToastManager);
  private destroy$ = inject(DestroyRef);
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  // Data
  productTypes = this.productTypesService.get({});
  contacts = this.contactsService.get({});

  // State
  form = this.formService.form;
  isLoading = this.productTypes.isLoading || this.contacts.isLoading;
  isSubmitLoading = signal(false);

  // Computed options
  productTypeOptions = computed(() => {
    const types = this.productTypes.value();
    return [
      {
        _id: undefined,
        name: 'Other',
      },
      ...types,
    ];
  });

  contactOptions = computed(() => {
    const contacts = this.contacts.value();
    return [
      {
        _id: undefined,
        name: 'Other',
      },
      ...contacts,
    ];
  });

  /**
   * Form control for the product type selection.
   * @returns Form control for the product type selection.
   */
  get typeIdControl() {
    return this.form.controls.productTypeIds;
  }

  /**
   * Form control for the make selection.
   * @returns Form control for the make selection.
   */
  get makeIdControl() {
    return this.form.controls.makeIds;
  }

  /**
   * Determines if the user is creating a new product type by checking if the
   * product type selection control has been touched and if the selected value
   * is undefined.
   *
   * @returns true if the user is creating a new product type, false otherwise
   */
  isCreatingNewProductType() {
    return this.typeIdControl.touched && this.typeIdControl.value === undefined;
  }

  isCreatingNewMake() {
    return this.makeIdControl.touched && this.makeIdControl.value === undefined;
  }

  /**
   * Opens the product form dialog and resets the form to its initial state.
   * This ensures that any previously entered data is cleared when the dialog
   * is opened anew.
   */

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  /**
   * Handles the submission of the form and creates a new product type if the
   * "Other" option is chosen.
   *
   * @param data the form data
   */
  async handleSubmit(data: FormValueState<CreateProductFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;

    // If the user is creating a new product type, create it first
    let productTypeResource: Observable<productType | string | undefined>;

    // If the user is creating a new make, create it first
    let makeResource: Observable<contact | string | undefined>;

    // Construct resource
    if (this.isCreatingNewProductType())
      productTypeResource = this.productTypesService.post({
        data: {
          name: rawValue.createdType.name!,
          description: rawValue.createdType.description!,
        },
      });
    else productTypeResource = of(rawValue.productTypeIds!);

    // Construct resource
    if (this.isCreatingNewMake())
      makeResource = this.contactsService.post({
        data: {
          name: rawValue.createdMake.oemName!,
          lastName: rawValue.createdMake.oemName!,
        },
      });
    else makeResource = of(rawValue.makeIds!);

    // Create the product type and make if needed
    forkJoin([productTypeResource, makeResource])
      .pipe(
        takeUntilDestroyed(this.destroy$),
        switchMap(([productType, make]) =>
          this.productsService.post({
            data: {
              productTypeIds: typeof productType === 'string' ? [productType] : [productType?._id],
              makeIds: typeof make === 'string' ? [make] : [make?._id],
              productModel: rawValue.productModel,
              serialNumber: rawValue.serialNumber,
              acquiredDate: rawValue.acquiredDate.toISOString(),
            },
          })
        )
      )
      .subscribe({
        complete: () => {
          this.isSubmitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.productMaintenanceContext.handleSaved();
          this.toastManager.showSuccess('Product created successfully');
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
