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
import { projectStage } from '../../modules/project-stages/interfaces/project-stage';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProjects } from '../../services/crud-projects';
import { ProjectForm as ProjectFormService, ProjectFormModel } from '../../services/project-form';
import { CrudProjectStages } from '../../modules/project-stages/services/crud-project-stages';

@Component({
  selector: 'bifi-app-project-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    TextareaModule,
    CheckboxModule,
    SelectModule,
    HasPermission,
  ],
  templateUrl: './project-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {
  protected formService = inject(ProjectFormService);
  private crudProjects = inject(CrudProjects);
  private crudProjectStages = inject(CrudProjectStages);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  projectResource = this.crudProjects.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  stagesResource = this.crudProjectStages.get({});
  defaultStageResource = this.crudProjectStages.get({
    searchParams: computed(() => ({ isDefault: true })),
  });

  isLoading = this.projectResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  form = this.formService.form;
  stages = computed<projectStage[]>(() => {
    const data = this.stagesResource.value();
    return Array.isArray(data) ? data : [];
  });

  constructor() {
    effect(() => {
      const entry = this.projectResource.value();

      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          description: entry.description ?? '',
          stage: entry.stage?._id ?? null,
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });

    effect(() => {
      const stage = this.defaultStageResource.value()[0];

      if (stage && !this.isUpdate()) {
        this.formService.patchValue({ stage: stage._id });
      }
    });
  }

  handleSubmit(data: FormValueState<ProjectFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const action = this.isUpdate()
      ? this.crudProjects.put({ _id: this.id(), data: rawValue })
      : this.crudProjects.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
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
