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
import { CrmForm as CrmFormService, CrmFormModel } from '../../services/crm-form';
import { CrudCrm } from '../../services/crud-crm';
import { CrudCrmStages } from '../../modules/crm-stages';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudCompanies } from '@avalantec/base-app/companies';

@Component({
  selector: 'bifi-app-crm-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ProgressBarModule,
  ],
  templateUrl: './crm-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrmFormComponent {
  private formService = inject(CrmFormService);
  private crudCrm = inject(CrudCrm);
  private crudContacts = inject(CrudContacts);
  private crudCompanies = inject(CrudCompanies);
  private crudCrmStages = inject(CrudCrmStages);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  crmResource = this.crudCrm.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  contactsResource = this.crudContacts.get({});
  companiesResource = this.crudCompanies.get({});
  stagesResource = this.crudCrmStages.get({});

  entry = this.crmResource.value;
  contactOptions = this.contactsResource.value;
  companyOptions = this.companiesResource.value;
  stageOptions = this.stagesResource.value;

  isLoading = computed(
    () =>
      this.crmResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.companiesResource.isLoading() ||
      this.stagesResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  form = this.formService.form;

  constructor() {
    effect(() => {
      const entry = this.entry();
      if (entry) {
        this.formService.patchValue({
          title: entry.title,
          amount: entry.amount,
          currency: entry.currency,
          stage: entry.stage?._id ?? '',
          probability: entry.probability,
          expectedCloseDate: entry.expectedCloseDate || '',
          contact: entry.contact?._id,
          company: entry.company?._id,
          owner: entry.owner?._id || '',
          description: entry.description || '',
          notes: entry.notes || '',
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  async handleSubmit(data: FormValueState<CrmFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    if (!rawValue.owner) delete (rawValue as Partial<CrmFormModel>).owner;
    if (!rawValue.stage) delete (rawValue as Partial<CrmFormModel>).stage;
    if (!rawValue.expectedCloseDate) delete (rawValue as Partial<CrmFormModel>).expectedCloseDate;
    if (!rawValue.description) delete (rawValue as Partial<CrmFormModel>).description;
    if (!rawValue.notes) delete (rawValue as Partial<CrmFormModel>).notes;

    const action = this.isUpdate()
      ? this.crudCrm.put({ _id: this.id() || '', data: rawValue })
      : this.crudCrm.post({ data: rawValue });

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
