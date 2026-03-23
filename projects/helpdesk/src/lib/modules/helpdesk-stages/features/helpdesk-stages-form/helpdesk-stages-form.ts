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
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { CrudHelpdeskStages } from '../../services/crud-helpdesk-stages';
import { HelpdeskStageForm, HelpdeskStageFormModel } from '../../../../services/helpdesk-stage-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-helpdesk-stages-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
  ],
  templateUrl: './helpdesk-stages-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpdeskStagesForm {
  private crudHelpdeskStages = inject(CrudHelpdeskStages);
  private formService = inject(HelpdeskStageForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  stageResource = this.crudHelpdeskStages.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  form = this.formService.form;
  stage = this.stageResource.value;
  isUpdate = computed(() => !!this.stage());
  loading = this.stageResource.isLoading;
  error = this.stageResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const stage = this.stage();
      if (stage) {
        this.formService.patchValue({
          name: stage.name,
          description: stage.description ?? '',
          isDefault: stage.isDefault,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<HelpdeskStageFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudHelpdeskStages.put({ _id: this.id(), data: values.rawValue })
      : this.crudHelpdeskStages.post({ data: values.rawValue });

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
