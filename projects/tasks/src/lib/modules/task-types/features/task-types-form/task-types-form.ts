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
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { CrudTaskTypes } from '../../services/crud-task-types';
import { TaskTypeForm, TaskTypeFormModel } from '../../services/task-type-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-task-types-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
  ],
  templateUrl: './task-types-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTypesForm {
  private crudTaskTypes = inject(CrudTaskTypes);
  private formService = inject(TaskTypeForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  typeResource = this.crudTaskTypes.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  form = this.formService.form;
  type = this.typeResource.value;
  isUpdate = computed(() => !!this.id());
  loading = this.typeResource.isLoading;
  error = this.typeResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const type = this.type();
      if (type) {
        this.formService.patchValue({
          name: type.name,
          description: type.description ?? '',
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<TaskTypeFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudTaskTypes.put({ _id: this.id(), data: values.rawValue })
      : this.crudTaskTypes.post({ data: values.rawValue });

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
