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
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudPaymentTerms } from '../../services/crud-payment-terms';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaymentTermFormService, PaymentTermFormModel } from '../../services/payment-term-form';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-payment-term-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    ToggleSwitchModule,
    ProgressBarModule,
    InputNumberModule,
    ButtonModule,
    TranslatePipe,
  ],
  templateUrl: './payment-term-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTermForm {
  private formService = inject(PaymentTermFormService);
  private crudPaymentTerms = inject(CrudPaymentTerms);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  paymentTermResource = this.crudPaymentTerms.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() => this.paymentTermResource.isLoading());
  isSubmitLoading = signal(false);

  form = this.formService.form;

  get lines(): FormGroup[] {
    return this.formService.lines;
  }

  addLine() {
    this.formService.addLine();
  }

  removeLine(index: number) {
    this.formService.removeLine(index);
  }

  constructor() {
    effect(() => {
      const entry = this.paymentTermResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          active: entry.active ?? true,
          lines: (entry.lines ?? []).map((line: any) => ({
            percentage: line.percentage,
            dueDays: line.dueDays,
          })),
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<PaymentTermFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudPaymentTerms.put({ _id: this.id(), data: rawValue as any })
      : this.crudPaymentTerms.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/accounting/payment-terms']);
  }
}
