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
import { DirtyComponent } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { CrudAssetCondition } from '../../services/crud-asset-conditions';
import { AssetConditionForm, AssetConditionFormModel } from '../../services/asset-condition-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-asset-conditions-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
    TranslatePipe,
  ],
  templateUrl: './asset-conditions-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Create/edit form for an Asset Condition. The route passes an optional `id`:
 * when present the existing condition is loaded and patched into the form,
 * otherwise a blank form is shown for creation.
 */
export class AssetConditionsForm implements DirtyComponent {
  private crudAssetConditions = inject(CrudAssetCondition);
  private formService = inject(AssetConditionForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>();

  assetConditionResource = this.crudAssetConditions.get({
    id: computed(() => this.id() ?? ''),
    triggerRequest: computed(() => this.id() !== undefined),
  });

  form = this.formService.form;

  assetCondition = this.assetConditionResource.value;

  isUpdate = computed(() => !!this.assetCondition());
  loading = this.assetConditionResource.isLoading;
  error = this.assetConditionResource.error;
  isSubmitLoading = signal<boolean>(false);

  /**
   * Reports whether the form has unsaved changes so the route's DirtyFormGuard
   * can prevent silent data loss on navigation.
   * @returns True when the form is dirty.
   */
  hasUnsavedChanges(): boolean {
    return this.formService.hasUnsavedChanges();
  }

  constructor() {
    effect(() => {
      const assetCondition = this.assetCondition();

      if (assetCondition) {
        this.formService.patchValue({
          name: assetCondition.name,
          description: assetCondition.description,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  /**
   * Submits the form: creates a new condition or updates the current one.
   * @param values - The validated form values.
   */
  handleSubmit(values: FormValueState<AssetConditionFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudAssetConditions.put({ _id: this.id(), data: values.rawValue })
      : this.crudAssetConditions.post({ data: values.rawValue });

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

  /** Navigates back to the list after a successful create/update. */
  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
