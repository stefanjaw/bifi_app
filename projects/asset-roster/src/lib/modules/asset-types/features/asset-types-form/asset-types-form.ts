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
import { CrudAssetType } from '../../services/crud-asset-types';
import { AssetTypeForm, AssetTypeFormModel } from '../../services/asset-type-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'bifi-app-asset-types-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
  ],
  templateUrl: './asset-types-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetTypesForm {
  private crudAssetTypes = inject(CrudAssetType);
  private formService = inject(AssetTypeForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  assetTypeResource = this.crudAssetTypes.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  form = this.formService.form;

  assetType = this.assetTypeResource.value;

  isUpdate = computed(() => !!this.assetType());
  loading = this.assetTypeResource.isLoading;
  error = this.assetTypeResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const assetType = this.assetType();

      if (assetType) {
        this.formService.patchValue({
          name: assetType.name,
          description: assetType.description,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<AssetTypeFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudAssetTypes.put({ _id: this.id(), data: values.rawValue })
      : this.crudAssetTypes.post({ data: values.rawValue });

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

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
