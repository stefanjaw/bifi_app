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
import { CrudCurrencies } from '@avalantec/base-app/currency';
import {
  CrudProducts,
  CrudStockBalances,
  CrudWarehouses,
  CrudLocations,
} from '@avalantec/inventory';
import { CrudTaxes } from '@avalantec/base-app/taxes';
import { CrudDiscounts } from '@avalantec/accounting';
import { CrudSalesOrderStages } from '../../modules/sales-order-stages';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { LineItemsTable } from '../../components/line-items-table/line-items-table';
import { calculateTotalsPerLine, TotalsPreview } from '../../utils/price-calculator';
import { salesOrderStatus } from '../../interfaces/sales-order';
import { DynamicBreadcrumbService } from '@avalantec/base-app/core';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-sales-order-detail',
  imports: [
    DecimalPipe,
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputText,
    InputNumberModule,
    TextareaModule,
    DatePickerModule,
    ProgressBarModule,
    TooltipModule,
    LineItemsTable,
    TranslatePipe,
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
  private crudCurrencies = inject(CrudCurrencies);
  private crudProducts = inject(CrudProducts);
  private crudStockBalances = inject(CrudStockBalances);
  private crudWarehouses = inject(CrudWarehouses);
  private crudLocations = inject(CrudLocations);
  private crudSalesOrderStages = inject(CrudSalesOrderStages);
  private crudTaxes = inject(CrudTaxes);
  private crudDiscounts = inject(CrudDiscounts);
  private dynamicBreadcrumb = inject(DynamicBreadcrumbService);
  private translationService = inject(TranslationService);
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
  currenciesResource = this.crudCurrencies.get({});
  productsResource = this.crudProducts.get({});
  stockResource = this.crudStockBalances.get({});
  warehousesResource = this.crudWarehouses.get({});
  locationsResource = this.crudLocations.get({});
  stagesResource = this.crudSalesOrderStages.get({});
  taxesResource = this.crudTaxes.get({});
  discountsResource = this.crudDiscounts.get({});

  entry = this.orderResource.value;

  crmOptions = computed(() => (this.crmResource.value() as any[]) ?? []);
  contactOptions = computed(() => (this.contactsResource.value() as any[]) ?? []);
  companyOptions = computed(() => (this.companiesResource.value() as any[]) ?? []);
  userOptions = computed(() => (this.usersResource.value() as any[]) ?? []);

  productOptions = computed(() => (this.productsResource.value() as any[]) ?? []);
  warehouseOptions = computed(() => (this.warehousesResource.value() as any[]) ?? []);
  locationOptions = computed(() => {
    const locations = (this.locationsResource.value() as any[]) ?? [];
    const warehouseId = this.form.controls.warehouseId.value;
    if (!warehouseId) return locations;
    return locations.filter((l: any) => {
      const w = l.warehouseId as any;
      const wid = typeof w === 'object' ? w?._id : w;
      return wid === warehouseId;
    });
  });
  stageOptions = computed(() => (this.stagesResource.value() as any[]) ?? []);

  currencyOptions = computed(() =>
    ((this.currenciesResource.value() as any[]) ?? []).filter((c: any) => c?.active !== false)
  );

  taxOptions = computed(() =>
    ((this.taxesResource.value() as any[]) ?? []).filter(
      (t: any) => t?.active === true && t?.taxType === 'sales'
    )
  );

  discountOptions = computed(() =>
    ((this.discountsResource.value() as any[]) ?? []).filter((d: any) => d?.active !== false)
  );

  defaultStageId = computed(() => {
    const stages = this.stageOptions();
    const def = stages.find((s: any) => s.isDefault);
    return def?._id ?? '';
  });

  defaultCurrencyId = computed(() => {
    const currencies = this.currencyOptions();
    const def = currencies.find((c: any) => c.isDefault);
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
      this.currenciesResource.isLoading() ||
      this.productsResource.isLoading() ||
      this.warehousesResource.isLoading() ||
      this.locationsResource.isLoading() ||
      this.stagesResource.isLoading() ||
      this.taxesResource.isLoading() ||
      this.discountsResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isPdfLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  canShip = computed(() => {
    const entry = this.entry();
    if (!entry) return false;
    const warehouseId =
      typeof entry.warehouseId === 'object' ? (entry.warehouseId?._id ?? '') : entry.warehouseId;
    const locationId =
      typeof entry.locationId === 'object' ? (entry.locationId?._id ?? '') : entry.locationId;
    return !!warehouseId && !!locationId;
  });

  form = this.formService.form;

  private lineItemValues = toSignal(
    this.formService.lineItemsArray.valueChanges.pipe(
      startWith(this.formService.lineItemsArray.value)
    ),
    { initialValue: this.formService.lineItemsArray.value }
  );

  totalsPreview = computed<TotalsPreview>(() => {
    const items = (this.lineItemValues() ?? []) as any[];
    const lineTaxIds = this.formService.lineTaxIds();
    const allTaxes = this.taxOptions();
    const allDiscounts = this.discountOptions();
    const discountedPrices = items.map((item: any) => {
      const discountId = item?.discountId;
      const discount = discountId ? allDiscounts.find((d: any) => d._id === discountId) : null;
      if (!discount) return Number(item?.unitPrice ?? 0);
      return discount.discountType === 'percentage'
        ? Number(item.unitPrice ?? 0) * (1 - discount.value / 100)
        : Math.max(0, Number(item.unitPrice ?? 0) - discount.value);
    });
    return calculateTotalsPerLine(items, lineTaxIds, allTaxes, discountedPrices);
  });

  statusOptions = computed(() => [
    {
      label: this.translationService.translate('sales.orderStatus.draft', {}, 'sales'),
      value: 'draft',
    },
    {
      label: this.translationService.translate('sales.orderStatus.quote', {}, 'sales'),
      value: 'quote',
    },
    {
      label: this.translationService.translate('sales.orderStatus.confirmed', {}, 'sales'),
      value: 'confirmed',
    },
    {
      label: this.translationService.translate('sales.orderStatus.shipped', {}, 'sales'),
      value: 'shipped',
    },
    {
      label: this.translationService.translate('sales.orderStatus.completed', {}, 'sales'),
      value: 'completed',
    },
    {
      label: this.translationService.translate('sales.orderStatus.cancelled', {}, 'sales'),
      value: 'cancelled',
    },
  ]);

  activeLanguage = this.translationService.activeLanguage;

  readonly today = computed(() => {
    const locale = this.activeLanguage();
    return new Date().toLocaleDateString(locale);
  });

  private statusLabels = computed<Record<string, string>>(() => ({
    draft: this.translationService.translate('sales.orderStatus.draft', {}, 'sales'),
    quote: this.translationService.translate('sales.orderStatus.quote', {}, 'sales'),
    confirmed: this.translationService.translate('sales.orderStatus.confirmed', {}, 'sales'),
    shipped: this.translationService.translate('sales.orderStatus.shipped', {}, 'sales'),
    completed: this.translationService.translate('sales.orderStatus.completed', {}, 'sales'),
    cancelled: this.translationService.translate('sales.orderStatus.cancelled', {}, 'sales'),
  }));

  statusLabel = computed(() => this.statusLabels()[this.entry()?.status ?? ''] ?? '');

  statusSteps = computed(() => {
    const status = this.entry()?.status ?? 'draft';
    const isCancelled = status === 'cancelled';
    const labels = this.statusLabels();

    const steps = [
      { key: 'draft', label: labels['draft'] },
      { key: 'quote', label: labels['quote'] },
      { key: 'confirmed', label: labels['confirmed'] },
      { key: 'shipped', label: labels['shipped'] },
      { key: 'completed', label: labels['completed'] },
    ];

    const activeIndex = isCancelled ? -1 : steps.findIndex(s => s.key === status);

    return steps.map((step, i) => ({
      ...step,
      done: !isCancelled && i < activeIndex,
      active: !isCancelled && i === activeIndex,
      future: isCancelled || i > activeIndex,
    }));
  });

  constructor() {
    effect(() => {
      const id = this.id();
      const entry = this.entry();
      if (id && entry?.number) {
        this.dynamicBreadcrumb.set(id, entry.number);
      }
    });

    this.destroy$.onDestroy(() => {
      const id = this.id();
      if (id) this.dynamicBreadcrumb.clear(id);
    });

    this.form.controls.amount.disable({ emitEvent: false });

    effect(() => {
      const warehouseId = this.form.controls.warehouseId.value;
      const locationId = this.form.controls.locationId.value;
      if (!warehouseId) {
        this.form.controls.locationId.setValue('', { emitEvent: false });
        return;
      }
      if (!locationId) return;
      const locations = (this.locationsResource.value() as any[]) ?? [];
      const loc = locations.find((l: any) => l._id === locationId);
      if (!loc) return;
      const w = loc.warehouseId as any;
      const wid = typeof w === 'object' ? w?._id : w;
      if (wid && wid !== warehouseId) {
        this.form.controls.locationId.setValue('', { emitEvent: false });
      }
    });

    effect(() => {
      const preview = this.totalsPreview();
      this.form.controls.amount.setValue(preview.grandTotal, { emitEvent: false });
    });

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
        const warehouseData = entry.warehouseId as any;
        const warehouseId = warehouseData?._id ?? warehouseData ?? '';
        const locationData = entry.locationId as any;
        const locationId = locationData?._id ?? locationData ?? '';
        const stageData = entry.stageId as any;
        const stageId = stageData?._id ?? stageData ?? '';
        const currencyData = entry.currency as any;
        const currencyId = currencyData?._id ?? currencyData ?? '';

        this.formService.patchValue({
          crmId,
          contact: contactId,
          company: companyId,
          salesperson: salespersonId,
          warehouseId,
          locationId,
          stageId,
          status: entry.status ?? 'draft',
          title: entry.title || '',
          amount: entry.amount,
          currency: currencyId,
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
          taxIds: Array.isArray(item.taxIds)
            ? item.taxIds
                .map((id: any) =>
                  typeof id === 'object' ? (id?._id?.toString() ?? '') : (id?.toString() ?? '')
                )
                .filter(Boolean)
            : [],
          discountId:
            typeof item.discountId === 'object'
              ? (item.discountId?._id ?? '')
              : (item.discountId ?? ''),
        }));
        this.formService.initLineItems(mappedLineItems);
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
        const defaultId = this.defaultStageId();
        if (defaultId) {
          this.formService.patchValue({ stageId: defaultId });
        }
        const defCurrency = this.defaultCurrencyId();
        if (defCurrency && !this.form.controls.currency.value) {
          this.formService.patchValue({ currency: defCurrency });
        }

        const crmIdParam = this.route.snapshot.queryParamMap.get('crmId');
        if (crmIdParam && !this.form.controls.crmId.value) {
          const crmEntry = this.crmOptions().find((c: any) => c._id === crmIdParam);
          if (crmEntry) {
            const crmCurrency = crmEntry.currency as any;
            this.formService.patchValue({
              crmId: crmEntry._id,
              title: crmEntry.title ?? '',
              contact: crmEntry.contact?._id ?? '',
              company: crmEntry.company?._id ?? '',
              salesperson: crmEntry.salesperson?._id ?? '',
              currency: crmCurrency?._id ?? this.defaultCurrencyId(),
              closeDate: crmEntry.expectedCloseDate
                ? new Date(crmEntry.expectedCloseDate)
                : new Date(),
              notes: crmEntry.notes ?? '',
            });
            this.form.markAsDirty();
          }
        }
      }
    });
  }

  goBack() {
    const isUpdate = this.isUpdate();
    this.router.navigate([isUpdate ? '../../' : '../'], { relativeTo: this.route });
  }

  markAsQuote() {
    if (!this.id()) return;
    this.crudSalesOrders
      .updateStatus(this.id(), 'quote')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.orderResource.reload() });
  }

  markAsConfirmed() {
    if (!this.id()) return;
    this.crudSalesOrders
      .updateStatus(this.id(), 'confirmed')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.orderResource.reload() });
  }

  markAsShipped() {
    if (!this.id()) return;
    this.crudSalesOrders
      .updateStatus(this.id(), 'shipped')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.orderResource.reload() });
  }

  markAsCompleted() {
    if (!this.id()) return;
    this.crudSalesOrders
      .updateStatus(this.id(), 'completed')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.orderResource.reload() });
  }

  cancelOrder() {
    if (!this.id()) return;
    this.crudSalesOrders
      .updateStatus(this.id(), 'cancelled')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.orderResource.reload() });
  }

  exportPdf() {
    if (!this.id() || this.isPdfLoading()) return;
    this.isPdfLoading.set(true);
    this.crudSalesOrders
      .openPdf(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => this.isPdfLoading.set(false),
        error: () => this.isPdfLoading.set(false),
      });
  }

  handleSubmit(data: FormValueState<SalesOrderFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const lineTaxIds = this.formService.lineTaxIds();
    const lineItems = (rawValue.lineItems ?? []).map((item: any, i: number) => ({
      productId: item.productId || undefined,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxIds: lineTaxIds[i] ?? [],
      discountId: item.discountId || null,
    }));

    const payload: Record<string, any> = {
      crmId: rawValue.crmId || undefined,
      contact: rawValue.contact,
      company: rawValue.company,
      salesperson: rawValue.salesperson || undefined,
      warehouseId: rawValue.warehouseId || undefined,
      locationId: rawValue.locationId || undefined,
      stageId: rawValue.stageId || undefined,
      status: rawValue.status as salesOrderStatus,
      title: rawValue.title,
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
          next: (newOrder: any) => {
            this.isSubmitLoading.set(false);
            this.router.navigate(['../edit', newOrder._id], { relativeTo: this.route });
          },
          error: () => this.isSubmitLoading.set(false),
        });
    }
  }
}
