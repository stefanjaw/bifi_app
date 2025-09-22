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
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudProductType } from '../../services/crud-product-types';
import { ProductTypeForm, ProductTypeFormModel } from '../../services/product-type-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'bifi-app-product-types-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
  ],
  templateUrl: './product-types-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTypesForm {
  private crudProductTypes = inject(CrudProductType);
  private formService = inject(ProductTypeForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  productTypeResource = this.crudProductTypes.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  form = this.formService.form;

  productType = this.productTypeResource.value;

  isUpdate = computed(() => !!this.productType());
  loading = this.productTypeResource.isLoading;
  error = this.productTypeResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const productType = this.productType();

      if (productType) {
        this.formService.patchValue({
          name: productType.name,
          description: productType.description,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  /**
   *
   * Submits the form and saves the product type.
   *
   * If the product type is being updated, it will call the PUT endpoint with the ID of the product type.
   * If the product type is being created, it will call the POST endpoint.
   *
   * It will also reset the form and navigate back to the list of product types.
   * @param values The form values to submit.
   */
  handleSubmit(values: FormValueState<ProductTypeFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudProductTypes.put({ _id: this.id(), data: values.rawValue })
      : this.crudProductTypes.post({ data: values.rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.formService.reset();
        this.goBack();
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  /**
   * Navigates back to the list of product types.
   *
   * If the product type is being updated, it will navigate to the list of product types.
   * If the product type is being created, it will navigate to the list of product types.
   */
  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
