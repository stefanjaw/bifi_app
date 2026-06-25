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
import { ProjectForm, ProjectFormModel } from '../../services/project-form';
import { CrudProjectStages } from '../../modules/project-stages/services/crud-project-stages';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { DatePickerModule } from 'primeng/datepicker';
import dayjs from 'dayjs';
import { ToastManager } from '@avalantec/base-app/core';
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
    SelectModule,
    HasPermission,
    DatePickerModule,
  ],
  templateUrl: './project-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsForm {
  protected formService = inject(ProjectForm);
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

  allProjectsResource = this.crudProjects.get({});

  stagesResource = this.crudProjectStages.get({});
  contactsResource = this.crudContacts.get({});
  defaultStageResource = this.crudProjectStages.get({
    searchParams: computed(() => ({ isDefault: true })),
  });

  isLoading = this.projectResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  form = this.formService.form;

  children = signal<project[]>([]);

  // Select options
  stages = computed<projectStage[]>(() => {
    const data = this.stagesResource.value();
    return Array.isArray(data) ? data : [];
  });

  contacts = computed(() => {
    const data = this.contactsResource.value();
    return Array.isArray(data) ? data : [];
  });

  parentOptions = computed<project[]>(() => {
    const all = this.allProjectsResource.value();
    const currentId = this.id();
    return Array.isArray(all) ? all.filter(p => p._id !== currentId) : [];
  });

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  constructor() {
    this._restoreParentIdFromQuery();

    effect(() => {
      const entry = this.projectResource.value();

      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          description: entry.description ?? '',
          stage: entry.stage?._id ?? '',
          priority: entry.priority,
          contactId: entry.contactId?._id ?? '',
          parentId: (entry.parentId as project)?._id ?? '',
          dateStart: entry.dateStart ? dayjs(entry.dateStart as any).toDate() : new Date(),
          dateEnd: entry.dateEnd ? dayjs(entry.dateEnd as any).toDate() : new Date(),
          sequence: entry.sequence ?? 10,
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
        this.children.set(entry.children ?? []);
      } else if (!this.isUpdate()) {
        this.formService.reset();
        this.formService.patchValue({ dateStart: new Date(), dateEnd: new Date() });
        this._restoreParentIdFromQuery();
        this.children.set([]);
      }
    });

    effect(() => {
      const stage = this.defaultStageResource.value()[0];

      if (stage && !this.isUpdate()) {
        this.formService.patchValue({ stage: stage._id });
      }
    });
  }

  private _restoreParentIdFromQuery(): void {
    if (this.isUpdate()) return;
    const params = this.route.snapshot.queryParams as Record<string, string>;
    const parentId = params['parentId'];
    if (parentId) {
      this.formService.patchValue({ parentId });
    }
  }

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
      parentId: rawValue.parentId || undefined,
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

  viewTasks(): void {
    const name = this.projectResource.value()?.name;
    if (!name) return;

    const filters = JSON.stringify([
      { field: 'projectId.name', operator: '==', value: name, type: 'string' },
    ]);

    this.router.navigate(['/tasks/view'], {
      queryParams: { _filters: filters, _view: 'list' },
    });
  }

  navigateToChild(childId: string) {
    this.router.navigate(['../../edit', childId], { relativeTo: this.route });
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
