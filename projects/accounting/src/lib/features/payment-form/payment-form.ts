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
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

/**
 * Create/edit form for payments (Phase 2, B6 fix).
 * Edit mode is enabled by the `payments/edit/:id` route: the payment is
 * fetched when `id` is set and the form is patched from it; submission
 * switches between `post` and `put` accordingly.
 */
@Component({
  selector: 'bifi-app-payment-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    SelectModule,
    ProgressBarModule,
    InputNumberModule,
    DatePickerModule,
    TranslatePipe,
  ],
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

  id = input<string>('');

  paymentResource = this.crudPayments.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  journalsResource = this.crudJournals.get({});
  currenciesResource = this.crudCurrencies.get({});
  contactsResource = this.crudContacts.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () =>
      this.paymentResource.isLoading() ||
      this.journalsResource.isLoading() ||
      this.currenciesResource.isLoading() ||
      this.contactsResource.isLoading()
  );
  isSubmitLoading = signal(false);

  form = this.formService.form;
  journals = this.journalsResource.value;
  currencies = this.currenciesResource.value;
  contacts = this.contactsResource.value;

  private translationService = inject(TranslationService);

  paymentTypeOptions = [
    {
      label: this.translationService.translate('options.inbound', {}, 'accounting'),
      value: 'inbound',
    },
    {
      label: this.translationService.translate('options.outbound', {}, 'accounting'),
      value: 'outbound',
    },
  ];

  /** Populates the form with the loaded payment in edit mode */
  constructor() {
    effect(() => {
      const entry = this.paymentResource.value();
      if (entry) {
        this.formService.patchValue({
          paymentType: entry.paymentType,
          partnerId: (entry.partnerId as any)?._id ?? entry.partnerId ?? '',
          journalId: (entry.journalId as any)?._id ?? entry.journalId ?? '',
          amount: entry.amount ?? 0,
          currencyId: (entry.currencyId as any)?._id ?? entry.currencyId ?? '',
          paymentDate: entry.paymentDate ? new Date(entry.paymentDate) : null,
          reference: entry.reference ?? '',
          exchangeRate: entry.exchangeRate ?? 0,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  /** Submits the payment (create or update) and navigates back */
  handleSubmit(data: FormValueState<PaymentFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const payload: any = {
      ...rawValue,
      partnerId: rawValue.partnerId || undefined,
      exchangeRate: rawValue.exchangeRate || undefined,
      paymentDate:
        rawValue.paymentDate instanceof Date
          ? rawValue.paymentDate.toISOString()
          : rawValue.paymentDate,
    };
    const action = this.isUpdate()
      ? this.crudPayments.put({ _id: this.id(), data: payload })
      : this.crudPayments.post({ data: payload });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/accounting/payments']);
  }
}
