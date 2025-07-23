import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CrudProductType } from '@avalantec/asset-roaster/modules/product-types/services/crud-product-types';
import {
  CreateEquipmentForm,
  CreateEquipmentFormModel,
} from '@avalantec/asset-roaster/modules/products/services/create-equipment-form';
import { BaseDialog } from '@avalantec/base-app/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { FormValueState } from 'dist/base-app/form';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CrudProductsService, productType } from 'projects/asset-roaster/src/public-api';
import { firstValueFrom } from 'rxjs';

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
  protected formService = inject(CreateEquipmentForm);
  private productTypesService = inject(CrudProductType);
  private productService = inject(CrudProductsService);

  // Input
  productTypes = this.productTypesService.get({});

  // State
  form = this.formService.form;
  isLoading = this.productTypes.isLoading;

  typeOptions = computed(() => {
    const types = this.productTypes.value();
    return [
      {
        _id: undefined,
        name: 'Other',
      },
      ...types,
    ];
  });

  makeOptions = computed(() => {
    // TODO get existing makes from backend
    return [
      {
        _id: undefined,
        name: 'Other',
      },
    ];
  });

  get typeIdControl() {
    return this.form.controls.productTypeIds;
  }

  get makeIdControl() {
    return this.form.controls.makeIds;
  }

  isCreatingNewType() {
    return this.typeIdControl.touched && this.typeIdControl.value === undefined;
  }

  isCreatingNewMake() {
    return this.makeIdControl.touched && this.makeIdControl.value === undefined;
  }

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
  async handleSubmit(data: FormValueState<CreateEquipmentFormModel>) {
    this.closeDialog();
    console.log('create call', data);

    const { rawValue } = data;

    const isCreatingType =
      rawValue.productTypeIds === undefined && rawValue.createdType.name !== null;

    let createdResource: productType | undefined = undefined;
    if (isCreatingType) {
      const dataForCreatingType = new FormData();
      dataForCreatingType.append('name', rawValue.createdType.name!);
      dataForCreatingType.append('description', rawValue.createdType.description!);

      alert('debug: creating product type');
      createdResource = await firstValueFrom(
        this.productTypesService.post({ formData: dataForCreatingType })
      );
    } else {
      alert('debug: not creating product type');
    }

    const productFormData = new FormData();
    if (createdResource) {
      productFormData.append('productTypeIds', JSON.stringify([createdResource!._id!]));
    } else {
      productFormData.append('productTypeIds', JSON.stringify([rawValue.productTypeIds!]));
    }

    // Todo
    // productFormData.append('makeIds', rawValue.makeIds!);
    productFormData.append('productModel', rawValue.productModel!);
    productFormData.append('serialNumber', rawValue.serialNumber!);
    productFormData.append('acquiredDate', rawValue.acquiredDate.toISOString()!);

    // TEST DEFAULT DATA
    productFormData.append('locationId', '686d5d093d7740384a749084');
    productFormData.append('acquiredPrice', '1000');
    productFormData.append('currentPrice', '1000');
    productFormData.append('condition', 'good');
    productFormData.append('makeIds', JSON.stringify(['686c094bfbc71e54c1e5ad90']));

    productFormData.append('vendorIds', JSON.stringify(['686c094bfbc71e54c1e5ad90']));

    productFormData.append('warrantyDate', new Date().toISOString()!);

    console.log('productFormData');
    for (const [key, value] of productFormData.entries()) {
      console.log(key, value);
    }

    alert('product post!');
    this.productService.post({ formData: productFormData }).subscribe(value => {
      alert('Product created ' + JSON.stringify(value, null, 2));
    });
  }
}
