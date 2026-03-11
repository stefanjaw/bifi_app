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
import { SalesOrderForm, SalesOrderFormModel } from '../../services/sales-order-form';
import { CrudSalesOrders } from '../../services/crud-sales-orders';
import { CrudCrm } from '../../services/crud-crm';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudCompanies } from '@avalantec/base-app/companies';
import { CrudUsers } from '@avalantec/base-app/users';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-sales-order-detail',
  imports: [
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    TextareaModule,
    DatePickerModule,
    ProgressBarModule,
  ],
  templateUrl: './sales-order-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesOrderDetail {
  private formService = inject(SalesOrderForm);
  private crudSalesOrders = inject(CrudSalesOrders);
  private crudCrm = inject(CrudCrm);
  private crudContacts = inject(CrudContacts);
  private crudCompanies = inject(CrudCompanies);
  private crudUsers = inject(CrudUsers);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  orderResource = this.crudSalesOrders.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  crmResource = this.crudCrm.get({});
  contactsResource = this.crudContacts.get({});
  companiesResource = this.crudCompanies.get({});
  usersResource = this.crudUsers.get({});

  entry = this.orderResource.value;

  crmOptions = computed(() => (this.crmResource.value() as any[]) ?? []);
  contactOptions = computed(() => (this.contactsResource.value() as any[]) ?? []);
  companyOptions = computed(() => (this.companiesResource.value() as any[]) ?? []);
  userOptions = computed(() => (this.usersResource.value() as any[]) ?? []);

  isLoading = computed(
    () =>
      this.orderResource.isLoading() ||
      this.crmResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.companiesResource.isLoading() ||
      this.usersResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  form = this.formService.form;

  currencyOptions = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'MXN', value: 'MXN' },
  ];

  constructor() {
    effect(() => {
      const entry = this.entry();
      if (!entry) return;

      const crmData = entry.crmId as any;
      const crmId = crmData?._id ?? crmData ?? '';
      const contactData = entry.contact as any;
      const contactId = contactData?._id ?? contactData ?? '';
      const companyData = entry.company as any;
      const companyId = companyData?._id ?? companyData ?? '';
      const salespersonData = entry.salesperson as any;
      const salespersonId = salespersonData?._id ?? salespersonData ?? '';

      this.formService.patchValue({
        crmId,
        contact: contactId,
        company: companyId,
        salesperson: salespersonId,
        amount: entry.amount,
        currency: entry.currency,
        closeDate: entry.closeDate || '',
        notes: entry.notes || '',
      });
      this.formService.resetDirtyState();
    });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  handleSubmit(data: FormValueState<SalesOrderFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const payload: Record<string, any> = {
      crmId: rawValue.crmId,
      contact: rawValue.contact,
      company: rawValue.company,
      salesperson: rawValue.salesperson || undefined,
      amount: rawValue.amount,
      currency: rawValue.currency,
      closeDate: rawValue.closeDate ? new Date(rawValue.closeDate).toISOString() : undefined,
      notes: rawValue.notes,
    };

    if (this.isUpdate()) {
      this.crudSalesOrders
        .put({ _id: this.id(), data: payload })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitLoading.set(false);
            this.orderResource.reload();
          },
          error: () => this.isSubmitLoading.set(false),
        });
    } else {
      this.crudSalesOrders
        .post({ data: payload })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitLoading.set(false);
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: () => this.isSubmitLoading.set(false),
        });
    }
  }
}
