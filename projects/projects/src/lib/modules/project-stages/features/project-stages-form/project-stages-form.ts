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
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import { CrudProjectStages } from '../../services/crud-project-stages';
import { ProjectStageForm, ProjectStageFormModel } from '../../services/project-stage-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-project-stages-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
    TranslatePipe,
  ],
  templateUrl: './project-stages-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStagesForm {
  private crudProjectStages = inject(CrudProjectStages);
  private formService = inject(ProjectStageForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translationService = inject(TranslationService);

  id = input<string>('');

  stageResource = this.crudProjectStages.get({
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
          isDefault: stage.isDefault,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<ProjectStageFormModel>) {
    this.isSubmitLoading.set(true);

    // Ensure description is never null, convert empty string to empty string if needed
    const processedData = {
      ...values.rawValue,
      description: values.rawValue.description || '',
    };

    const action = this.isUpdate()
      ? this.crudProjectStages.put({ _id: this.id(), data: processedData })
      : this.crudProjectStages.post({ data: processedData });

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
