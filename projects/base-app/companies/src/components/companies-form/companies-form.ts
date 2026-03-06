import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CompanyForm, CompanyFormModel } from '../../services/company-form';
import { CrudCompanies } from '../../services/crud-companies';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudCountries } from '@avalantec/base-app/countries';
import { CrudCurrencies } from '@avalantec/base-app/currency';

@Component({
  selector: 'bifi-app-companies-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    SelectModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
  ],
  templateUrl: './companies-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesForm implements OnInit {
  private formService = inject(CompanyForm);
  private crudCompanies = inject(CrudCompanies);
  private crudContacts = inject(CrudContacts);
  private crudCountries = inject(CrudCountries);
  private crudCurrencies = inject(CrudCurrencies);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  companyResource = this.crudCompanies.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });
  contactsResource = this.crudContacts.get({});
  countriesResource = this.crudCountries.get({});
  currenciesResource = this.crudCurrencies.get({});

  company = this.companyResource.value;
  contacts = this.contactsResource.value;
  countries = this.countriesResource.value;
  currencies = this.currenciesResource.value;

  form = this.formService.form;
  loading = computed(
    () =>
      this.companyResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.countriesResource.isLoading() ||
      this.currenciesResource.isLoading(),
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.company());
  error = this.companyResource.error;

  constructor() {
    effect(() => {
      const company = this.company();

      if (company) {
        this.formService.patchValue({
          name: company.name,
          address: company.address,
          countryId: company.countryId?._id,
          contactId: company.contactId?._id,
          defaultCurrencyId: (company as any).defaultCurrencyId?._id ?? (company as any).defaultCurrencyId ?? '',
        });
      } else {
        this.formService.reset();
      }
    });
  }

  ngOnInit() {
    this.formService.reset();
  }

  async handleSubmit(data: FormValueState<CompanyFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;

    const action = this.isUpdate()
      ? this.crudCompanies.put({ _id: this.company()?._id || '', data: rawValue })
      : this.crudCompanies.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
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
