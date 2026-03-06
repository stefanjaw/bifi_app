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
import { CrudExchangeRates } from '../../services/crud-exchange-rates';
import { CrudCurrencies } from '../../services/crud-currencies';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExchangeRateFormService, ExchangeRateFormModel } from '../../services/exchange-rate-form.service';

@Component({
  selector: 'bifi-app-exchange-rate-form',
  imports: [FormModule, ReactiveFormsModule, SelectModule, InputNumberModule, ToggleSwitchModule, DatePickerModule, ProgressBarModule],
  templateUrl: './exchange-rate-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRateForm {
  protected formService = inject(ExchangeRateFormService);
  private crudExchangeRates = inject(CrudExchangeRates);
  private crudCurrencies = inject(CrudCurrencies);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  form = this.formService.form;

  exchangeRateResource = this.crudExchangeRates.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  currenciesResource = this.crudCurrencies.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() =>
    this.exchangeRateResource.isLoading() || this.currenciesResource.isLoading()
  );
  isSubmitLoading = signal(false);

  currencies = this.currenciesResource.value;

  constructor() {
    effect(() => {
      const entry = this.exchangeRateResource.value();
      if (entry) {
        this.formService.patchValue({
          fromCurrencyId: entry.fromCurrencyId?._id ?? '',
          toCurrencyId: entry.toCurrencyId?._id ?? '',
          rate: entry.rate,
          effectiveDate: entry.effectiveDate ? new Date(entry.effectiveDate) : null,
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<ExchangeRateFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudExchangeRates.put({
          _id: this.id(),
          data: {
            ...rawValue,
            effectiveDate: rawValue.effectiveDate instanceof Date ? rawValue.effectiveDate.toISOString() : rawValue.effectiveDate,
          } as any,
        })
      : this.crudExchangeRates.post({
          data: {
            ...rawValue,
            effectiveDate: rawValue.effectiveDate instanceof Date ? rawValue.effectiveDate.toISOString() : rawValue.effectiveDate,
          } as any,
        });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/settings/currencies/exchange-rates']);
  }
}
