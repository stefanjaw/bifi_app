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
import { BaseForm, FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudExchangeRates } from '../../services/crud-exchange-rates';
import { CrudCurrencies } from '../../services/crud-currencies';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ExchangeRateFormModel {
  fromCurrencyId: string;
  toCurrencyId: string;
  rate: number;
  effectiveDate: string;
  active: boolean;
}

@Component({
  selector: 'bifi-app-exchange-rate-form',
  imports: [FormModule, ReactiveFormsModule, SelectModule, InputNumberModule, ToggleSwitchModule, DatePickerModule, ProgressBarModule],
  templateUrl: './exchange-rate-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRateForm extends BaseForm<ExchangeRateFormModel> {
  private crudExchangeRates = inject(CrudExchangeRates);
  private crudCurrencies = inject(CrudCurrencies);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

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

  override createForm() {
    return this.fb.group<ExchangeRateFormModel>({
      fromCurrencyId: ['', [Validators.required]],
      toCurrencyId: ['', [Validators.required]],
      rate: [1, [Validators.required, Validators.min(0)]],
      effectiveDate: ['', [Validators.required]],
      active: [true],
    });
  }

  constructor() {
    super();
    effect(() => {
      const entry = this.exchangeRateResource.value();
      if (entry) {
        this.patchValue({
          fromCurrencyId: entry.fromCurrencyId?._id ?? '',
          toCurrencyId: entry.toCurrencyId?._id ?? '',
          rate: entry.rate,
          effectiveDate: entry.effectiveDate,
          active: entry.active ?? true,
        });
        this.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<ExchangeRateFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudExchangeRates.put({ _id: this.id(), data: rawValue as any })
      : this.crudExchangeRates.post({ data: rawValue as any });

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
