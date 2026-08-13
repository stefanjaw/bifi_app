import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  model,
} from '@angular/core';
import { CrmForm, CrmFormModel } from '../../services/crm-form';
import { CrudCrm } from '../../services/crud-crm';
import { CrudCrmStages } from '../../modules/crm-stages';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudCompanies } from '@avalantec/base-app/companies';
import { CrudUsers } from '@avalantec/base-app/users';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { DraftService, DirtyComponent, autoForm } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ProgressBarModule } from 'primeng/progressbar';
import { HasPermission } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-crm-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    FormsModule,
    InputText,
    ButtonModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ProgressBarModule,
    TranslatePipe,
    HasPermission,
  ],
  templateUrl: './crm-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrmsForm implements DirtyComponent {
  private formService = inject(CrmForm);
  private crudCrm = inject(CrudCrm);
  private crudContacts = inject(CrudContacts);
  private crudCompanies = inject(CrudCompanies);
  private crudCrmStages = inject(CrudCrmStages);
  private crudCurrencies = inject(CrudCurrencies);
  private crudUsers = inject(CrudUsers);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private draftService = inject(DraftService);

  id = input<string>('');

  crmResource = this.crudCrm.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  contactsResource = this.crudContacts.get({});
  companiesResource = this.crudCompanies.get({});
  stagesResource = this.crudCrmStages.get({});
  defaultStageResource = this.crudCrmStages.get({
    searchParams: computed(() => ({ isDefault: true })),
  });
  usersResource = this.crudUsers.get({});
  currenciesResource = this.crudCurrencies.get({});

  entry = this.crmResource.value;
  contactOptions = this.contactsResource.value;
  companyOptions = this.companiesResource.value;
  currencyOptions = this.currenciesResource.value;
  stageOptions = this.stagesResource.value;
  userOptions = this.usersResource.value;

  isLoading = computed(
    () =>
      this.crmResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.companiesResource.isLoading() ||
      this.stagesResource.isLoading() ||
      this.usersResource.isLoading() ||
      this.currenciesResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.entry());

  contactNameModel = model('');
  contactMethodModel = model('');
  companyNameModel = model('');

  form = this.formService.form;
  constructor() {
    autoForm(
      this.form,
      this.router,
      this.draftService,
      this.entry,
      computed(() => !!this.id()),
      entry => {
        this.formService.patchValue({
          title: entry.title,
          amount: entry.amount,
          currency: entry.currency?._id ?? '',
          stage: entry.stage?._id ?? '',
          probability: entry.probability,
          expectedCloseDate: entry.expectedCloseDate ? entry.expectedCloseDate.split('T')[0] : '',
          contact: entry.contact?._id,
          company: entry.company?._id || '',
          owner: entry.owner?._id || '',
          salesperson: entry.salesperson?._id || '',
          tagsInput: (entry.tags ?? []).join(', '),
          description: entry.description || '',
          notes: entry.notes || '',
        });
        this.formService.resetDirtyState();
      }
    );

    effect(() => {
      const stage = (this.defaultStageResource.value() as any[])[0];
      if (stage && !this.isUpdate()) {
        this.formService.patchValue({ stage: stage._id });
      }
    });

    // Auto-select the company's default currency when a company is chosen and
    // no currency has been picked yet. The company's `defaultCurrencyId` is
    // autopopulated by the backend.
    this.form.controls.company.valueChanges
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(companyId => {
        if (this.isUpdate()) return;
        if (!this.form.controls.currency.value) {
          const defaultId = this.companyDefaultCurrencyId(companyId ?? '');
          if (defaultId) this.formService.patchValue({ currency: defaultId });
        }
      });
  }

  async handleSubmit(data: FormValueState<CrmFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const tags = rawValue.tagsInput
      ? rawValue.tagsInput
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      : [];

    const payload: Record<string, any> = {
      title: rawValue.title,
      amount: rawValue.amount,
      contact: rawValue.contact,
      company: rawValue.company,
      tags,
    };

    if (rawValue.currency) payload['currency'] = rawValue.currency;
    if (rawValue.probability != null) payload['probability'] = rawValue.probability;
    if (rawValue.stage) payload['stage'] = rawValue.stage;
    if (rawValue.owner) payload['owner'] = rawValue.owner;
    if (rawValue.salesperson) payload['salesperson'] = rawValue.salesperson;
    if (rawValue.expectedCloseDate) payload['expectedCloseDate'] = rawValue.expectedCloseDate;
    if (rawValue.description) payload['description'] = rawValue.description;
    if (rawValue.notes) payload['notes'] = rawValue.notes;

    const action = this.isUpdate()
      ? this.crudCrm.put({ _id: this.id() || '', data: payload as any })
      : this.crudCrm.post({ data: payload as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.formService.form.markAsUntouched();
        this.formService.form.markAsPristine();
        this.goBack();
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/sales/opportunities']);
  }

  /**
   * Resolves the default currency id configured on the given company.
   * The backend autopopulates `defaultCurrencyId` on company records, so it
   * may arrive as a populated object (`{ _id, code, ... }`) or a bare id.
   * @param companyId - The selected company id (empty string allowed).
   * @returns The company's default currency id, or an empty string when the
   * company has no default currency or cannot be found.
   */
  private companyDefaultCurrencyId(companyId: string): string {
    if (!companyId) return '';
    const company = (this.companyOptions() as any[]).find((c: any) => c._id === companyId);
    if (!company) return '';
    const currency = (company as any).defaultCurrencyId;
    return currency?._id ?? currency ?? '';
  }

  /** Navigates to the order creation form pre-filled from this opportunity (update view only) */
  createOrderFromOpportunity() {
    this.router.navigate(['/sales/orders/new'], {
      queryParams: { crmId: this.id() },
    });
  }

  hasUnsavedChanges(): boolean {
    return this.formService.hasUnsavedChanges();
  }

  handleContactCreation() {}
  handleCompanyCreation() {}
}
