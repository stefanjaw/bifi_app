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
import { CrudUomCategories } from '../../services/crud-uom-categories';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UomCategoryFormService, UomCategoryFormModel } from '../../services/uom-category-form';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-uom-category-form',
  imports: [FormModule, ReactiveFormsModule, InputText, ProgressBarModule, TranslatePipe],
  templateUrl: './uom-category-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UomCategoryForm {
  protected formService = inject(UomCategoryFormService);
  private crudUomCategories = inject(CrudUomCategories);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  form = this.formService.form;

  categoryResource = this.crudUomCategories.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = this.categoryResource.isLoading;
  isSubmitLoading = signal(false);

  constructor() {
    effect(() => {
      const entry = this.categoryResource.value();
      if (entry) {
        this.formService.patchValue({ name: entry.name });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<UomCategoryFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudUomCategories.put({ _id: this.id(), data: rawValue as any })
      : this.crudUomCategories.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.router.navigate(['/inventory/uom-categories']);
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/inventory/uom-categories']);
  }
}
