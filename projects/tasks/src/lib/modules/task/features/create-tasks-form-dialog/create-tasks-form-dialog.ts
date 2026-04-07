import { TasksMaintenanceContext } from './../../services/tasks-maintenance-context';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, ToastManager } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CreateTaskForm, CreateTaskFormModel } from '../../services/create-task-form';
import { CrudTasks } from '../../services/crud-tasks';
import { CrudTaskTypes } from '../../../task-types';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SliderModule } from 'primeng/slider';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import dayjs from 'dayjs';
import { CrudProjects } from '@avalantec/projects';

@Component({
  selector: 'bifi-app-create-tasks-form-dialog',
  imports: [
    ReactiveFormsModule,
    DatePickerModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    FormModule,
    SliderModule,
    TextareaModule,
    CheckboxModule,
  ],
  templateUrl: './create-tasks-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTasksFormDialog extends BaseDialog {
  protected formService = inject(CreateTaskForm);
  private crudTasks = inject(CrudTasks);
  private crudTaskTypes = inject(CrudTaskTypes);
  private crudProjects = inject(CrudProjects);
  private destroy$ = inject(DestroyRef);
  private tasksMaintenanceContext = inject(TasksMaintenanceContext);
  private toastManager = inject(ToastManager);

  // Data
  tasks = this.crudTasks.get({ triggerRequest: this.dialogState });
  taskTypes = this.crudTaskTypes.get({ triggerRequest: this.dialogState });
  projects = this.crudProjects.get({ triggerRequest: this.dialogState });

  // State
  form = this.formService.form;
  isLoading = computed(
    () => this.tasks.isLoading() || this.taskTypes.isLoading() || this.projects.isLoading()
  );
  isSubmitLoading = signal(false);
  taskProgress = toSignal(this.form.controls.progress.valueChanges);

  constructor() {
    super();

    // Listen for changes to the parentId input
    this.tasksMaintenanceContext.openCreateSubTaskDialog$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(id => {
        this.formService.patchValue({ parentId: id });
        this.form.controls.parentId.markAsDirty();
      });
  }

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  async handleSubmit(data: FormValueState<CreateTaskFormModel>) {
    const { rawValue } = data;

    // Set default values
    const plannedStartDate = dayjs(rawValue.plannedStartDate);
    const plannedEndDate = dayjs(rawValue.plannedEndDate);

    if (plannedEndDate.isBefore(plannedStartDate)) {
      this.toastManager.showError('Planned start date must be before planned end date');
      return;
    }

    if (!rawValue.parentId) delete rawValue.parentId;
    if (!rawValue.progress) delete rawValue.progress;
    if (!rawValue.projectId) delete rawValue.projectId;

    this.isSubmitLoading.set(true);

    this.crudTasks
      .post({
        data: {
          ...rawValue,
          plannedStartDate: plannedStartDate.toISOString(),
          plannedEndDate: plannedEndDate.toISOString(),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.tasksMaintenanceContext.taskCreatedOrUpdated();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
