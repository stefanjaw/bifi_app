import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudPayments } from '../../services/crud-payments';
import { CrudJournals } from '../../services/crud-journals';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaymentFormService, PaymentFormModel } from '../../services/payment-form';

@Component({
  selector: 'bifi-app-payment-form',
  imports: [FormModule, ReactiveFormsModule, InputText, SelectModule, ProgressBarModule, InputNumberModule, DatePickerModule],
  templateUrl: './payment-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentForm {
  private formService = inject(PaymentFormService);
  private crudPayments = inject(CrudPayments);
  private crudJournals = inject(CrudJournals);
  private crudCurrencies = inject(CrudCurrencies);
  private crudContacts = inject(CrudContacts);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  journalsResource = this.crudJournals.get({});
  currenciesResource = this.crudCurrencies.get({});
  contactsResource = this.crudContacts.get({});

  isLoading = computed(
    () =>
      this.journalsResource.isLoading() ||
      this.currenciesResource.isLoading() ||
      this.contactsResource.isLoading(),
  );
  isSubmitLoading = signal(false);

  form = this.formService.form;
  journals = this.journalsResource.value;
  currencies = this.currenciesResource.value;
  contacts = this.contactsResource.value;

  paymentTypeOptions = [
    { label: 'Inbound', value: 'inbound' },
    { label: 'Outbound', value: 'outbound' },
  ];

  handleSubmit(data: FormValueState<PaymentFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const payload: any = {
      ...rawValue,
      partnerId: rawValue.partnerId || undefined,
      exchangeRate: rawValue.exchangeRate || undefined,
    };
    this.crudPayments.post({ data: payload })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => { this.isSubmitLoading.set(false); this.goBack(); },
        error: () => this.isSubmitLoading.set(false),
      });
  }

  goBack() {
    this.router.navigate(['/accounting/payments']);
  }
}
