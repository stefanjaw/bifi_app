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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudCountries } from '@avalantec/base-app/countries';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { TranslatePipe } from '@avalantec/base-app/translation';

@Component({
  selector: 'bifi-app-companies-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    SelectModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    ToggleSwitchModule,
    TranslatePipe,
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

  typeOptions = signal([
    { label: 'Company', value: 'company' },
    { label: 'Branch Office', value: 'branch-office' },
  ]);

  companyResource = this.crudCompanies.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });
  companiesResource = this.crudCompanies.get({});
  contactsResource = this.crudContacts.get({});
  countriesResource = this.crudCountries.get({});
  currenciesResource = this.crudCurrencies.get({});

  company = this.companyResource.value;
  companies = computed(() =>
    (this.companiesResource.value() ?? []).filter((c: any) => c.type !== 'branch-office')
  );
  contacts = this.contactsResource.value;
  countries = this.countriesResource.value;
  currencies = this.currenciesResource.value;

  form = this.formService.form;
  loading = computed(
    () =>
      this.companyResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.countriesResource.isLoading() ||
      this.currenciesResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.company());
  typeValue = toSignal(
    this.form.get('type')!.valueChanges.pipe(startWith(this.form.get('type')!.value))
  );
  isBranchOffice = computed(() => this.typeValue() === 'branch-office');
  error = this.companyResource.error;

  constructor() {
    effect(() => {
      const company = this.company();

      if (company) {
        this.formService.patchValue({
          type: company.type ?? 'company',
          name: company.name,
          address: company.address,
          countryId: company.countryId?._id,
          contactId: company.contactId?._id,
          defaultCurrencyId:
            (company as any).defaultCurrencyId?._id ?? (company as any).defaultCurrencyId ?? '',
          parentCompany:
            (company.parentCompany as any)?._id ?? (company.parentCompany as any) ?? '',
          branchCode: company.branchCode ?? '',
          isDefault: company.isDefault ?? false,
        });
      } else {
        this.formService.reset();
      }
    });

    effect(() => {
      const isBranchOffice = this.isBranchOffice();
      const parentCompanyControl = this.form.get('parentCompany');
      if (!parentCompanyControl) return;
      if (isBranchOffice) {
        parentCompanyControl.setValidators([Validators.required]);
      } else {
        parentCompanyControl.clearValidators();
        parentCompanyControl.setValue('');
      }
      parentCompanyControl.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.formService.reset();
    const defaultType = this.route.snapshot.data['defaultType'];
    if (defaultType) {
      this.form.get('type')?.setValue(defaultType);
    }
  }

  async handleSubmit(data: FormValueState<CompanyFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;
    if (!rawValue.defaultCurrencyId) delete (rawValue as any).defaultCurrencyId;
    if (!rawValue.parentCompany) delete (rawValue as any).parentCompany;
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
