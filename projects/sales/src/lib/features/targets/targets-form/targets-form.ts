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
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudSalesTargets } from '../../../services/crud-sales-targets';
import { SalesTargetForm, SalesTargetFormModel } from '../../../services/sales-target-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudUsers } from '@avalantec/base-app/users';

@Component({
  selector: 'bifi-app-targets-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputText,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    ProgressBarModule,
  ],
  templateUrl: './targets-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetsForm {
  private crudSalesTargets = inject(CrudSalesTargets);
  private crudUsers = inject(CrudUsers);
  private formService = inject(SalesTargetForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  targetResource = this.crudSalesTargets.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  usersResource = this.crudUsers.get({});

  form = this.formService.form;

  target = this.targetResource.value;
  userOptions = this.usersResource.value;
  isUpdate = computed(() => !!this.id());
  isLoading = computed(() => this.targetResource.isLoading() || this.usersResource.isLoading());
  isSubmitLoading = signal(false);

  monthOptions = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  constructor() {
    effect(() => {
      const t = this.target();
      if (t) {
        this.formService.patchValue({
          name: t.name,
          year: t.year,
          month: t.month,
          targetAmount: t.targetAmount,
          currency: t.currency,
          salesperson: t.salesperson?._id ?? '',
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<SalesTargetFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    if (!rawValue.salesperson) delete (rawValue as Partial<SalesTargetFormModel>).salesperson;

    const action = this.isUpdate()
      ? this.crudSalesTargets.put({ _id: this.id(), data: rawValue })
      : this.crudSalesTargets.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.formService.reset();
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
