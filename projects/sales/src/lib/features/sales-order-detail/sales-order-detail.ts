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
import { CrudProducts, CrudStockBalances } from '@avalantec/inventory';
import { CrudSalesOrderStages } from '../../modules/sales-order-stages';
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
import { LineItemsTable } from '../../components/line-items-table/line-items-table';

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
    LineItemsTable,
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
  private crudProducts = inject(CrudProducts);
  private crudStockBalances = inject(CrudStockBalances);
  private crudSalesOrderStages = inject(CrudSalesOrderStages);
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
  productsResource = this.crudProducts.get({});
  stockResource = this.crudStockBalances.get({});
  stagesResource = this.crudSalesOrderStages.get({});

  entry = this.orderResource.value;

  crmOptions = computed(() => (this.crmResource.value() as any[]) ?? []);
  contactOptions = computed(() => (this.contactsResource.value() as any[]) ?? []);
  companyOptions = computed(() => (this.companiesResource.value() as any[]) ?? []);
  userOptions = computed(() => (this.usersResource.value() as any[]) ?? []);

  productOptions = computed(() => (this.productsResource.value() as any[]) ?? []);
  stageOptions = computed(() => (this.stagesResource.value() as any[]) ?? []);

  defaultStageId = computed(() => {
    const stages = this.stageOptions();
    const def = stages.find((s: any) => s.isDefault);
    return def?._id ?? '';
  });

  stockMap = computed<Record<string, number>>(() => {
    const balances = (this.stockResource.value() as any[]) ?? [];
    return balances.reduce((map: Record<string, number>, balance: any) => {
      const productId =
        typeof balance.productId === 'object' ? balance.productId?._id : balance.productId;
      if (productId) {
        map[productId] = (map[productId] ?? 0) + (balance.quantity ?? 0);
      }
      return map;
    }, {});
  });

  isLoading = computed(
    () =>
      this.orderResource.isLoading() ||
      this.crmResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.companiesResource.isLoading() ||
      this.usersResource.isLoading() ||
      this.productsResource.isLoading() ||
      this.stagesResource.isLoading()
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
      if (entry) {
        const crmData = entry.crmId as any;
        const crmId = crmData?._id ?? crmData ?? '';
        const contactData = entry.contact as any;
        const contactId = contactData?._id ?? contactData ?? '';
        const companyData = entry.company as any;
        const companyId = companyData?._id ?? companyData ?? '';
        const salespersonData = entry.salesperson as any;
        const salespersonId = salespersonData?._id ?? salespersonData ?? '';

        const stageData = entry.stageId as any;
        const stageId = stageData?._id ?? stageData ?? '';

        this.formService.patchValue({
          crmId,
          contact: contactId,
          company: companyId,
          salesperson: salespersonId,
          stageId,
          amount: entry.amount,
          currency: entry.currency,
          closeDate: new Date(entry.closeDate),
          notes: entry.notes || '',
        });

        const rawLineItems = (entry.lineItems ?? []) as any[];
        const mappedLineItems = rawLineItems.map((item: any) => ({
          productId:
            typeof item.productId === 'object'
              ? (item.productId?._id ?? '')
              : (item.productId ?? ''),
          description: item.description ?? '',
          quantity: item.quantity ?? 1,
          unitPrice: item.unitPrice ?? 0,
          total: item.total ?? 0,
        }));
        this.formService.patchLineItems(mappedLineItems);
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
        const defaultId = this.defaultStageId();
        if (defaultId) {
          this.formService.patchValue({ stageId: defaultId });
        }
      }
    });
  }

  goBack() {
    const isUpdate = this.isUpdate();
    this.router.navigate([isUpdate ? '../../' : '../'], { relativeTo: this.route });
  }

  handleSubmit(data: FormValueState<SalesOrderFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const lineItems = (rawValue.lineItems ?? []).map((item: any) => ({
      productId: item.productId || undefined,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: (item.quantity ?? 0) * (item.unitPrice ?? 0),
    }));

    const payload: Record<string, any> = {
      crmId: rawValue.crmId || undefined,
      contact: rawValue.contact,
      company: rawValue.company,
      salesperson: rawValue.salesperson || undefined,
      stageId: rawValue.stageId || undefined,
      amount: rawValue.amount,
      currency: rawValue.currency,
      closeDate: rawValue.closeDate ? new Date(rawValue.closeDate).toISOString() : undefined,
      notes: rawValue.notes,
      lineItems,
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
