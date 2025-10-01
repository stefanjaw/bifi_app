import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { contact, CrudContacts } from '@avalantec/base-app/settings';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CrudProducts } from '../../services/crud-products';
import { CrudProductType, productType } from '../../../product-types';
import { CreateProductForm, CreateProductFormModel } from '../../services/create-product-form';
import { ProductMaintenanceContext } from '../../services/product-maintenance-context';
import { FormModule, FormValueState } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-product-form-dialog',
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    FormModule,
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
  private destroy$ = inject(DestroyRef);
  private productMaintenanceContext = inject(ProductMaintenanceContext);

  // Data
  productTypes = this.productTypesService.get({ triggerRequest: this.dialogState });
  contacts = this.contactsService.get({ triggerRequest: this.dialogState });

  // State
  form = this.formService.form;
  isLoading = computed(() => this.productTypes.isLoading() || this.contacts.isLoading());
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

    try {
      // Construct type resource
      if (this.isCreatingNewProductType())
        productTypeResource = this.productTypesService.post({
          data: {
            name: rawValue.createdType.name!,
            description: rawValue.createdType.description!,
          },
        });
      else productTypeResource = of(rawValue.productTypeIds!);

      // Construct make resource
      if (this.isCreatingNewMake())
        makeResource = this.contactsService.post({
          data: {
            name: rawValue.createdMake.oemName!,
            lastName: rawValue.createdMake.oemName!,
            type: 'company',
          },
        });
      else makeResource = of(rawValue.makeIds!);

      const type = await firstValueFrom(productTypeResource);
      const make = await firstValueFrom(makeResource);

      // Construct product resource
      const productResource = this.productsService.post({
        data: {
          productTypeIds: typeof type === 'string' ? [type] : [type?._id],
          makeIds: typeof make === 'string' ? [make] : [make?._id],
          productModel: rawValue.productModel,
          serialNumber: rawValue.serialNumber,
          acquiredDate: rawValue.acquiredDate.toISOString(),
        },
      });

      const product = await firstValueFrom(productResource);

      if (!product) throw new Error('Failed to create product');

      this.isSubmitLoading.set(false);
      this.formService.reset();
      this.closeDialog();
      this.productMaintenanceContext.handleSaved();
    } catch {
      this.isSubmitLoading.set(false);
    }
  }
}
