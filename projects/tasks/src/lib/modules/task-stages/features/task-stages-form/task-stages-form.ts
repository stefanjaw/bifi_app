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
import { CrudTaskStages } from '../../services/crud-task-stages';
import { TaskStageForm, TaskStageFormModel } from '../../services/task-stage-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-task-stages-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
  ],
  templateUrl: './task-stages-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStagesForm {
  private crudTaskStages = inject(CrudTaskStages);
  private formService = inject(TaskStageForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  stageResource = this.crudTaskStages.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  form = this.formService.form;
  stage = this.stageResource.value;
  isUpdate = computed(() => !!this.id());
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
          color: stage.color ?? '#6366f1',
          isDefault: stage.isDefault,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<TaskStageFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudTaskStages.put({ _id: this.id(), data: values.rawValue })
      : this.crudTaskStages.post({ data: values.rawValue });

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
