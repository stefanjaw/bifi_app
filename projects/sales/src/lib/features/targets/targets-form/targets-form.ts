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
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

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
    TranslatePipe,
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
  private translationService = inject(TranslationService);

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

  monthOptions = computed(() => [
    { label: this.translationService.translate('sales.months.january', {}, 'sales'), value: 1 },
    { label: this.translationService.translate('sales.months.february', {}, 'sales'), value: 2 },
    { label: this.translationService.translate('sales.months.march', {}, 'sales'), value: 3 },
    { label: this.translationService.translate('sales.months.april', {}, 'sales'), value: 4 },
    { label: this.translationService.translate('sales.months.may', {}, 'sales'), value: 5 },
    { label: this.translationService.translate('sales.months.june', {}, 'sales'), value: 6 },
    { label: this.translationService.translate('sales.months.july', {}, 'sales'), value: 7 },
    { label: this.translationService.translate('sales.months.august', {}, 'sales'), value: 8 },
    { label: this.translationService.translate('sales.months.september', {}, 'sales'), value: 9 },
    { label: this.translationService.translate('sales.months.october', {}, 'sales'), value: 10 },
    { label: this.translationService.translate('sales.months.november', {}, 'sales'), value: 11 },
    { label: this.translationService.translate('sales.months.december', {}, 'sales'), value: 12 },
  ]);

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
