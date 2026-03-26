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
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProducts } from '../../services/crud-products';
import { CrudUoms } from '../../services/crud-uoms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductFormService, ProductFormModel } from '../../services/product-form.service';

@Component({
  selector: 'bifi-app-product-form',
  imports: [FormModule, ReactiveFormsModule, ButtonModule, InputText, InputNumberModule, TextareaModule, SelectModule, ProgressBarModule, HasPermission],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  protected formService = inject(ProductFormService);
  private crudProducts = inject(CrudProducts);
  private crudUoms = inject(CrudUoms);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  form = this.formService.form;

  productResource = this.crudProducts.get({ id: this.id, triggerRequest: computed(() => !!this.id()) });
  uomsResource = this.crudUoms.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() => this.productResource.isLoading() || this.uomsResource.isLoading());
  isSubmitLoading = signal(false);

  uoms = this.uomsResource.value;

  constructor() {
    effect(() => {
      const entry = this.productResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          sku: entry.sku,
          description: entry.description ?? '',
          unitOfMeasureId: (entry.unitOfMeasureId as any)?._id ?? entry.unitOfMeasureId ?? '',
          costPrice: entry.costPrice,
          salePrice: entry.salePrice,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<ProductFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudProducts.put({ _id: this.id(), data: rawValue as any })
      : this.crudProducts.post({ data: rawValue as any });

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
