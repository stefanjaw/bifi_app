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
import { CrudContacts } from '@avalantec/base-app/contacts';
import { DatePickerModule } from 'primeng/datepicker';
import dayjs from 'dayjs';
import { ToastManager } from '@avalantec/base-app/core';

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
    DatePickerModule,
  ],
  templateUrl: './project-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {
  protected formService = inject(ProjectFormService);
  private crudProjects = inject(CrudProjects);
  private crudProjectStages = inject(CrudProjectStages);
  private crudContacts = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastManager = inject(ToastManager);

  id = input<string>('');

  projectResource = this.crudProjects.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  stagesResource = this.crudProjectStages.get({});
  contactsResource = this.crudContacts.get({});
  defaultStageResource = this.crudProjectStages.get({
    searchParams: computed(() => ({ isDefault: true })),
  });

  isLoading = this.projectResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  form = this.formService.form;

  // Select options
  stages = computed<projectStage[]>(() => {
    const data = this.stagesResource.value();
    return Array.isArray(data) ? data : [];
  });

  contacts = computed(() => {
    const data = this.contactsResource.value();
    return Array.isArray(data) ? data : [];
  });

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  /**
   * Initialize the form with the project data if the project is being updated
   * or reset the form if the project is not being updated.
   * If the project is not being updated and the default stage is available,
   * initialize the form with the default stage.
   */
  constructor() {
    effect(() => {
      const entry = this.projectResource.value();

      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          description: entry.description ?? '',
          stage: entry.stage?._id ?? '',
          priority: entry.priority,
          contactId: entry.contactId?._id ?? '',
          dateStart: entry.dateStart ? new Date(entry.dateStart) : new Date(),
          dateEnd: entry.dateEnd ? new Date(entry.dateEnd) : new Date(),
          sequence: entry.sequence ?? 10,
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

  /**
   * Handles submitting the project form.
   *
   * If the project is being updated, it will call the projects service put method.
   * If the project is being created, it will call the projects service post method.
   *
   * @param data - The form value state
   */
  handleSubmit(data: FormValueState<ProjectFormModel>) {
    const { rawValue } = data;

    const payload = {
      name: rawValue.name,
      description: rawValue.description,
      stage: rawValue.stage,
      priority: rawValue.priority,
      dateStart: rawValue.dateStart.toISOString(),
      dateEnd: rawValue.dateEnd.toISOString(),
      contactId: rawValue.contactId || undefined,
      sequence: rawValue.sequence,
      active: rawValue.active,
    };

    if (dayjs(payload.dateEnd).isBefore(dayjs(payload.dateStart))) {
      this.toastManager.showError('Start date must be before end date');
      return;
    }

    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudProjects.put({ _id: this.id(), data: payload })
      : this.crudProjects.post({ data: payload });

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
