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
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CrudPurchaseStages } from '../../services/crud-purchase-stages';
import { PurchaseStageForm, PurchaseStageFormModel } from '../../services/purchase-stage-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-purchase-stages-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
    ToggleSwitchModule,
    TranslatePipe,
  ],
  templateUrl: './purchase-stages-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseStagesForm {
  private crudPurchaseStages = inject(CrudPurchaseStages);
  private formService = inject(PurchaseStageForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  stageResource = this.crudPurchaseStages.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  form = this.formService.form;

  stage = this.stageResource.value;
  isUpdate = computed(() => !!this.stage());
  loading = this.stageResource.isLoading;
  error = this.stageResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const s = this.stage();
      if (s) {
        this.formService.patchValue({
          name: s.name,
          description: s.description ?? '',
          color: s.color,
          order: s.order,
          isDefault: s.isDefault ?? false,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<PurchaseStageFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudPurchaseStages.put({ _id: this.id(), data: values.rawValue })
      : this.crudPurchaseStages.post({ data: values.rawValue });

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
