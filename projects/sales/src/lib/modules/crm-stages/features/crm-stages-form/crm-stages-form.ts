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
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { CrudCrmStages } from '../../services/crud-crm-stages';
import { CrmStageForm, CrmStageFormModel } from '../../services/crm-stage-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-crm-stages-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
  ],
  templateUrl: './crm-stages-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrmStagesForm {
  private crudCrmStages = inject(CrudCrmStages);
  private formService = inject(CrmStageForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  crmStageResource = this.crudCrmStages.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  form = this.formService.form;

  crmStage = this.crmStageResource.value;
  isUpdate = computed(() => !!this.crmStage());
  loading = this.crmStageResource.isLoading;
  error = this.crmStageResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const stage = this.crmStage();

      if (stage) {
        this.formService.patchValue({
          name: stage.name,
          description: stage.description ?? '',
          color: stage.color,
          order: stage.order,
          probability: stage.probability,
          isWon: stage.isWon,
          isLost: stage.isLost,
          isDefault: stage.isDefault,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<CrmStageFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudCrmStages.put({ _id: this.id(), data: values.rawValue })
      : this.crudCrmStages.post({ data: values.rawValue });

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
