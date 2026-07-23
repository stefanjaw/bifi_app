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
import { DraftService, DirtyComponent } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ProgressBarModule } from 'primeng/progressbar';

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
  isUpdate = computed(() => !!this.id());

  contactNameModel = model('');
  contactMethodModel = model('');
  companyNameModel = model('');

  form = this.formService.form;
  private draftRestored = false;

  constructor() {
    effect(() => {
      const entry = this.entry();

      if (!this.draftRestored) {
        const draftWrapper = this.draftService.getDraft(this.router.url);
        if (draftWrapper) {
          const draft = draftWrapper.data;
          this.form.patchValue(draft);
          this.form.markAsDirty();
          this.draftService.clearDraft(this.router.url);
          this.draftRestored = true;
          return;
        }
      }

      if (this.draftRestored) return;

      if (entry) {
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
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });

    effect(() => {
      const stage = (this.defaultStageResource.value() as any[])[0];
      if (stage && !this.isUpdate()) {
        this.formService.patchValue({ stage: stage._id });
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
      currency: rawValue.currency,
      probability: rawValue.probability,
      contact: rawValue.contact,
      company: rawValue.company,
      tags,
    };

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

  hasUnsavedChanges(): boolean {
    return this.formService.hasUnsavedChanges();
  }

  handleContactCreation() {}
  handleCompanyCreation() {}
}
