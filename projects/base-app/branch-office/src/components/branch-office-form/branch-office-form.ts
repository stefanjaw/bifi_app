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
import { CrudBranchOffices } from '../../services/crud-branch-offices';
import { CrudCompanies } from '@avalantec/base-app/companies';
import { CrudCountries } from '@avalantec/base-app/countries';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface BranchOfficeFormModel {
  companyId: string;
  name: string;
  branchCode: string;
  address: string;
  phone: string;
  email: string;
  countryId: string;
  active: boolean;
  isDefault: boolean;
}

@Component({
  selector: 'bifi-app-branch-office-form',
  imports: [FormModule, ReactiveFormsModule, InputText, SelectModule, ToggleSwitchModule, ProgressBarModule],
  templateUrl: './branch-office-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchOfficeForm extends BaseForm<BranchOfficeFormModel> {
  private crudBranchOffices = inject(CrudBranchOffices);
  private crudCompanies = inject(CrudCompanies);
  private crudCountries = inject(CrudCountries);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  branchOfficeResource = this.crudBranchOffices.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  companiesResource = this.crudCompanies.get({});
  countriesResource = this.crudCountries.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () =>
      this.branchOfficeResource.isLoading() ||
      this.companiesResource.isLoading() ||
      this.countriesResource.isLoading(),
  );
  isSubmitLoading = signal(false);

  companies = this.companiesResource.value;
  countries = this.countriesResource.value;

  override createForm() {
    return this.fb.group<BranchOfficeFormModel>({
      companyId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      branchCode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: [''],
      email: [''],
      countryId: [''],
      active: [true],
      isDefault: [false],
    });
  }

  constructor() {
    super();
    effect(() => {
      const entry = this.branchOfficeResource.value();
      if (entry) {
        this.patchValue({
          companyId: entry.companyId?._id ?? '',
          name: entry.name,
          branchCode: entry.branchCode,
          address: entry.address,
          phone: entry.phone ?? '',
          email: entry.email ?? '',
          countryId: entry.countryId?._id ?? '',
          active: entry.active ?? true,
          isDefault: entry.isDefault ?? false,
        });
        this.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<BranchOfficeFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudBranchOffices.put({ _id: this.id(), data: rawValue as any })
      : this.crudBranchOffices.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/settings/branch-offices']);
  }
}
