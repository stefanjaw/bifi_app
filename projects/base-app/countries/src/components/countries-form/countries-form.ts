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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { ReactiveFormsModule } from '@angular/forms';
import { CrudCountries } from '../../services/crud-countries';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryForm, CountryFormModel } from '../../services/country-form';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-countries-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    TextareaModule,
    TranslatePipe,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './countries-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesForm {
  // Form logic goes here
  private crudCountries = inject(CrudCountries);
  private formService = inject(CountryForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  // Fetch country if id is provided
  country = this.crudCountries.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  form = this.formService.form;

  countryData = this.country.value;

  isUpdate = computed(() => !!this.countryData());
  loading = this.country.isLoading;
  error = this.country.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const country = this.countryData();

      if (country) {
        this.form.patchValue({
          name: country.name,
          code: country.code,
          currencyCode: country.currencyCode,
          currencySymbol: country.currencySymbol,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  //handleSubmit
  handleSubmit(values: FormValueState<CountryFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudCountries.put({ _id: this.id(), data: values.rawValue })
      : this.crudCountries.post({ data: values.rawValue });

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

  // Navigate back to the list
  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
