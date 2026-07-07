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
import { SelectModule } from 'primeng/select';
import { CrudMaintenanceWindows } from '../../services/crud-maintenance-windows';
import {
  MaintenanceWindowForm,
  MaintenanceWindowFormModel,
} from '../../services/maintenance-window-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-maintenance-windows-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    SelectModule,
    TranslatePipe,
  ],
  templateUrl: './maintenance-windows-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceWindowsForm {
  private readonly crudMaintenanceWindows = inject(CrudMaintenanceWindows);
  private readonly formService = inject(MaintenanceWindowForm);
  private readonly destroy$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id = input.required<string>();

  maintenanceWindowResource = this.crudMaintenanceWindows.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  maintenanceWindow = this.maintenanceWindowResource.value;

  form = this.formService.form;

  isUpdate = computed(() => !!this.maintenanceWindow());
  loading = this.maintenanceWindowResource.isLoading;
  error = this.maintenanceWindowResource.error;
  isSubmitLoading = signal<boolean>(false);

  recurrencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Semi-anually', value: 'semi-anually' },
    { label: 'Annually', value: 'annually' },
  ];

  constructor() {
    effect(() => {
      const maintenanceWindow = this.maintenanceWindow();

      if (maintenanceWindow) {
        this.formService.patchValue({
          name: maintenanceWindow.name,
          daysBefore: maintenanceWindow.daysBefore,
          daysAfter: maintenanceWindow.daysAfter,
          recurrency: maintenanceWindow.recurrency,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<MaintenanceWindowFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudMaintenanceWindows.put({ _id: this.id(), data: values.rawValue })
      : this.crudMaintenanceWindows.post({ data: values.rawValue });

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
