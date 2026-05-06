import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormModule, FormUploader, FormValueState } from '@avalantec/base-app/form';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProducts } from '../../services/crud-products';
import { CrudUoms } from '../../services/crud-uoms';
import { CrudProductTypes } from '../../services/crud-product-types';
import { CrudTaxes } from '@avalantec/accounting';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUpload } from 'primeng/fileupload';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductFormService, ProductFormModel } from '../../services/product-form.service';

@Component({
  selector: 'bifi-app-product-form',
  imports: [
    FormModule,
    FormUploader,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    ProgressBarModule,
    FileUpload,
    HasPermission,
  ],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  protected formService = inject(ProductFormService);
  private crudProducts = inject(CrudProducts);
  private crudUoms = inject(CrudUoms);
  private crudProductTypes = inject(CrudProductTypes);
  private crudTaxes = inject(CrudTaxes);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  form = this.formService.form;

  productResource = this.crudProducts.get({ id: this.id, triggerRequest: computed(() => !!this.id()) });
  uomsResource = this.crudUoms.get({});
  productTypesResource = this.crudProductTypes.get({});
  taxesResource = this.crudTaxes.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() =>
    this.productResource.isLoading() ||
    this.uomsResource.isLoading() ||
    this.productTypesResource.isLoading() ||
    this.taxesResource.isLoading(),
  );
  isSubmitLoading = signal(false);

  uoms = this.uomsResource.value;

  productTypes = this.productTypesResource.value;
  saleTaxOptions = computed(() =>
    ((this.taxesResource.value() as any[]) ?? []).filter(
      (t: any) => t?.taxType === 'sales',
    ),
  );
  purchaseTaxOptions = computed(() =>
    ((this.taxesResource.value() as any[]) ?? []).filter(
      (t: any) => t?.taxType === 'purchase',
    ),
  );

  defaultSaleTaxIds = signal<string[]>([]);
  defaultPurchaseTaxIds = signal<string[]>([]);

  onSaleTaxesChange(value: string[] | null) {
    this.defaultSaleTaxIds.set(value ?? []);
    this.form.markAsDirty();
  }

  onPurchaseTaxesChange(value: string[] | null) {
    this.defaultPurchaseTaxIds.set(value ?? []);
    this.form.markAsDirty();
  }

  constructor() {
    effect(() => {
      const entry = this.productResource.value();
      if (entry) {
        this.formService.form.controls.photo.clear();
        this.formService.form.controls.attachments.clear();

	this.defaultSaleTaxIds.set(
          ((entry.defaultSaleTaxIds ?? []) as any[]).map((id: any) =>
            id?._id?.toString() ?? id?.toString() ?? '',
          ).filter(Boolean),
        );
        this.defaultPurchaseTaxIds.set(
          ((entry.defaultPurchaseTaxIds ?? []) as any[]).map((id: any) =>
            id?._id?.toString() ?? id?.toString() ?? '',
          ).filter(Boolean),
        );

        this.formService.patchValue({
          name: entry.name,
          sku: entry.sku,
          description: entry.description ?? '',
          unitOfMeasureId: (entry.unitOfMeasureId as any)?._id ?? entry.unitOfMeasureId ?? '',
          productTypeId: (entry.productTypeId as any)?._id ?? entry.productTypeId ?? '',
          costPrice: entry.costPrice,
          salePrice: entry.salePrice,
          photo: entry.photo ? [{ id: entry.photo, file: null! }] : [],
          attachments: entry.attachments?.map(a => ({ id: a.fileId, file: null! })) ?? [],
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.form.controls.photo.clear();
        this.formService.form.controls.attachments.clear();
	this.defaultSaleTaxIds.set([]);
        this.defaultPurchaseTaxIds.set([]);
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<ProductFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const payload = {
      ...rawValue,
      defaultSaleTaxIds: this.defaultSaleTaxIds() ?? [],
      defaultPurchaseTaxIds: this.defaultPurchaseTaxIds() ?? [],
    };

    const action = this.isUpdate()
      ? this.crudProducts.put({
          _id: this.id(),
          data: payload,
          fileFields: ['photo', 'attachments'],
        })
      : this.crudProducts.post({ data: payload, fileFields: ['photo', 'attachments'] });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/inventory/products']);
  }
}
