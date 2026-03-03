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
import { CrudUoms } from '../../services/crud-uoms';
import { CrudUomCategories } from '../../services/crud-uom-categories';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface UomFormModel {
  name: string;
  symbol: string;
  categoryId: string;
}

@Component({
  selector: 'bifi-app-uom-form',
  imports: [FormModule, ReactiveFormsModule, ButtonModule, InputText, SelectModule, ProgressBarModule],
  templateUrl: './uom-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UomForm extends BaseForm<UomFormModel> {
  private crudUoms = inject(CrudUoms);
  private crudUomCategories = inject(CrudUomCategories);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  uomResource = this.crudUoms.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  categoriesResource = this.crudUomCategories.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() => this.uomResource.isLoading() || this.categoriesResource.isLoading());
  isSubmitLoading = signal(false);

  categories = this.categoriesResource.value;

  override createForm() {
    return this.fb.group<UomFormModel>({
      name: ['', [Validators.required]],
      symbol: [''],
      categoryId: ['', [Validators.required]],
    });
  }

  constructor() {
    super();
    effect(() => {
      const entry = this.uomResource.value();
      if (entry) {
        this.patchValue({
          name: entry.name,
          symbol: entry.symbol ?? '',
          categoryId: (entry.categoryId as any)?._id ?? entry.categoryId ?? '',
        });
        this.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<UomFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudUoms.put({ _id: this.id(), data: rawValue as any })
      : this.crudUoms.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.router.navigate(['/inventory/uoms']);
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/inventory/uoms']);
  }
}
