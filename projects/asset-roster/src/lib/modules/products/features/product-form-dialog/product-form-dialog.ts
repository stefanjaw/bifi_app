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
import { CrudContacts } from '@avalantec/base-app/contacts';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CrudProducts } from '../../services/crud-products';
import { CrudProductType } from '../../../product-types';
import { CreateProductForm, CreateProductFormModel } from '../../services/create-product-form';
import { ProductMaintenanceContext } from '../../services/product-maintenance-context';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

    this.productsService
      .post({
        data: {
          productModel: rawValue.productModel,
          serialNumber: rawValue.serialNumber,
          acquiredDate: rawValue.acquiredDate.toISOString(),
          ...(this.isCreatingNewProductType() && {
            productTypeInformation: {
              name: rawValue.createdType.name!,
              description: rawValue.createdType.description!,
            },
          }),
          ...(this.isCreatingNewMake() && {
            makeInformation: {
              name: rawValue.createdMake.oemName!,
              lastName: rawValue.createdMake.oemName!,
              type: 'company',
            },
          }),
          ...(!this.isCreatingNewProductType() && {
            productTypeIds: [rawValue.productTypeIds],
          }),
          ...(!this.isCreatingNewMake() && {
            makeIds: [rawValue.makeIds],
          }),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.productMaintenanceContext.handleSaved();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
