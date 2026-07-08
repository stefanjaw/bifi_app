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
import { CrudProductTypes } from '../../services/crud-product-types';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductTypeFormService, ProductTypeFormModel } from '../../services/product-type-form';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-product-type-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    TextareaModule,
    ToggleSwitchModule,
    ProgressBarModule,
    TranslatePipe,
  ],
  templateUrl: './product-type-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTypeForm {
  protected formService = inject(ProductTypeFormService);
  private crudProductTypes = inject(CrudProductTypes);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  form = this.formService.form;

  productTypeResource = this.crudProductTypes.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = this.productTypeResource.isLoading;
  isSubmitLoading = signal(false);

  constructor() {
    effect(() => {
      const entry = this.productTypeResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          description: entry.description ?? '',
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<ProductTypeFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudProductTypes.put({ _id: this.id(), data: rawValue as any })
      : this.crudProductTypes.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/settings/inventory/product-types']);
  }
}
