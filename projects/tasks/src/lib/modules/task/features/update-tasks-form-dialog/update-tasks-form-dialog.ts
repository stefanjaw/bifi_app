import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  Signal,
} from '@angular/core';
import { BaseDialog, ToastManager } from '@avalantec/base-app/core';
import { CrudTasks } from '../../services/crud-tasks';
import { UpdateTaskForm, UpdateTaskFormModel } from '../../services/update-task-form';
import { TasksMaintenanceContext } from '../../services/tasks-maintenance-context';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FileResolver, FilterManager } from '@avalantec/base-app/resource';
import { CrudTaskProjects } from '../../../task-projects';
import { CrudTaskStages } from '../../../task-stages';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { SliderModule } from 'primeng/slider';
import dayjs from 'dayjs';
import { CrudUsers } from '@avalantec/base-app/users';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-update-tasks-form-dialog',
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    FormModule,
    SliderModule,
    ButtonModule,
  ],
  templateUrl: './update-tasks-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTasksFormDialog extends BaseDialog {
  protected formService = inject(UpdateTaskForm);
  private crudTasks = inject(CrudTasks);
  private crudTaskProjects = inject(CrudTaskProjects);
  private crudTaskStages = inject(CrudTaskStages);
  private crudUsers = inject(CrudUsers);
  private destroy$ = inject(DestroyRef);
  protected taskMaintenanceContext = inject(TasksMaintenanceContext);
  private filterManager = inject(FilterManager);
  private fileResolver = inject(FileResolver);
  private toastManager = inject(ToastManager);

  // Resources
  _id = toSignal(this.taskMaintenanceContext.openUpdateTaskDialog$) as Signal<string>;

  taskResource = this.crudTasks.get({
    id: this._id,
    triggerRequest: computed(() => this.dialogState() && this._id() !== undefined),
  });

  tasksResource = this.crudTasks.get({
    searchParams: computed(() =>
      this.filterManager.getFilterObjectUtil([
        {
          filters: [
            {
              field: '_id',
              operator: '!=',
              value: this._id(),
              type: 'string',
            },
          ],
          operator: 'and',
        },
      ])
    ),
    triggerRequest: this.dialogState,
  });

  taskProjectsResource = this.crudTaskProjects.get({
    triggerRequest: this.dialogState,
  });

  taskStagesResource = this.crudTaskStages.get({
    triggerRequest: this.dialogState,
  });

  usersResource = this.crudUsers.get({
    triggerRequest: this.dialogState,
  });

  // Data
  task = this.taskResource.value;
  tasks = this.tasksResource.value;
  parentTasks = computed(() => this.tasks().filter(t => t.parentId?._id !== this._id()));
  taskProjects = this.taskProjectsResource.value;
  taskStages = this.taskStagesResource.value;
  users = this.usersResource.value;

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  // State
  form = this.formService.form;
  isLoading = computed(
    () =>
      this.taskResource.isLoading() ||
      this.taskProjectsResource.isLoading() ||
      this.taskStagesResource.isLoading() ||
      this.tasksResource.isLoading()
  );
  isSubmitLoading = signal(false);
  taskProgress = toSignal(this.form.controls.progress.valueChanges);

  /**
   * Constructor
   *
   * Patch the form with the task data
   */
  constructor() {
    super();

    effect(async () => {
      const task = this.task();

      if (task) {
        const parsedAttachments = await Promise.all(
          task.attachments?.map(async file => ({
            id: file.fileId,
            file: (await this.fileResolver.resolveFile({ metadata: file }))!,
          })) || []
        );

        this.formService.patchValue({
          name: task.name,
          description: task.description,
          plannedStartDate: dayjs(task.plannedStartDate).toDate(),
          plannedEndDate: dayjs(task.plannedEndDate).toDate(),
          // convert from seconds to hours
          plannedDuration: Number(((task.plannedDuration || 0) / 3600).toFixed(2)),
          progress: task.progress,
          projectId: task.projectId?._id,
          stage: task.stage?._id,
          parentId: task.parentId?._id,
          priority: task.priority,
          assigned: task.assigned?._id,
          dependencyIds: task.dependencyIds?.map(dep => dep._id),
          attachments: parsedAttachments,
        });
      } else {
        this.formService.reset();
        this.formService.form.markAsPristine();
        this.formService.form.markAsUntouched();
      }
    });
  }

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<UpdateTaskFormModel>) {
    const { dirtyValue, rawValue } = data;

    // Validate the dates are correct before submitting if they have been changed
    if (dirtyValue.plannedStartDate || dirtyValue.plannedEndDate) {
      const plannedStartDate = dayjs(rawValue.plannedStartDate as Date | undefined);
      const plannedEndDate = dayjs(rawValue.plannedEndDate as Date | undefined);

      if (
        plannedEndDate.isBefore(plannedStartDate) ||
        plannedEndDate.isSame(plannedStartDate, 'day')
      ) {
        this.toastManager.showError('Planned start date must be before planned end date');
        return;
      }
    }

    // Update the task
    this.isSubmitLoading.set(true);

    this.crudTasks
      .put({
        _id: this._id(),
        data: {
          ...dirtyValue,
          ...(dirtyValue.plannedStartDate && {
            plannedStartDate: dirtyValue.plannedStartDate.toISOString(),
          }),
          ...(dirtyValue.plannedEndDate && {
            plannedEndDate: dirtyValue.plannedEndDate.toISOString(),
          }),
          ...(dirtyValue.plannedDuration && {
            plannedDuration: Number(((rawValue.plannedDuration || 0) * 3600).toFixed(0)),
          }),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.taskMaintenanceContext.taskCreatedOrUpdated();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
