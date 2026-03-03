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
import { BaseForm, FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudUomCategories } from '../../services/crud-uom-categories';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface UomCategoryFormModel {
  name: string;
}

@Component({
  selector: 'bifi-app-uom-category-form',
  imports: [FormModule, ReactiveFormsModule, InputText, ProgressBarModule],
  templateUrl: './uom-category-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UomCategoryForm extends BaseForm<UomCategoryFormModel> {
  private crudUomCategories = inject(CrudUomCategories);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  categoryResource = this.crudUomCategories.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = this.categoryResource.isLoading;
  isSubmitLoading = signal(false);

  override createForm() {
    return this.fb.group<UomCategoryFormModel>({
      name: ['', [Validators.required]],
    });
  }

  constructor() {
    super();
    effect(() => {
      const entry = this.categoryResource.value();
      if (entry) {
        this.patchValue({ name: entry.name });
        this.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.reset();
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
