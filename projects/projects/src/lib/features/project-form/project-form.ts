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
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProjects } from '../../services/crud-projects';
import { ProjectForm as ProjectFormService, ProjectFormModel } from '../../services/project-form';
import { project } from '../../interfaces/projects';

@Component({
  selector: 'bifi-app-project-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    TextareaModule,
    CheckboxModule,
    HasPermission,
  ],
  templateUrl: './project-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {
  protected formService = inject(ProjectFormService);
  private crudProjects = inject(CrudProjects);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  projectResource = this.crudProjects.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isLoading = this.projectResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  form = this.formService.form;

  constructor() {
    effect(() => {
      const entry = this.projectResource.value() as project | undefined;
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          description: entry.description ?? '',
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<ProjectFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const action = this.isUpdate()
      ? this.crudProjects.put({ _id: this.id(), data: rawValue as project })
      : this.crudProjects.post({ data: rawValue as project });

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
