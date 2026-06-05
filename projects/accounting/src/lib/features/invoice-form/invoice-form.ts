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
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { PluginSlot, providePluginContext } from '@avalantec/base-app/plugin-system';
import { CrudInvoices } from '../../services/crud-invoices';
import { CrudJournals } from '../../services/crud-journals';
import { CrudAccounts } from '../../services/crud-accounts';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudTaxes } from '@avalantec/base-app/taxes';
import { CrudPaymentTerms } from '../../services/crud-payment-terms';
import { CrudDiscounts } from '../../services/crud-discounts';
import { CrudProducts } from '@avalantec/inventory';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { InvoiceFormService, InvoiceFormModel } from '../../services/invoice-form';

@Component({
  selector: 'bifi-app-invoice-form',
  imports: [
    FormModule,
    PluginSlot,
    ReactiveFormsModule,
    InputText,
    SelectModule,
    MultiSelectModule,
    ProgressBarModule,
    InputNumberModule,
    ButtonModule,
    DatePickerModule,
    TabsModule,
    DecimalPipe,
    TagModule,
  ],
  templateUrl: './invoice-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providePluginContext(InvoiceForm)],
})
export class InvoiceForm {
  private formService = inject(InvoiceFormService);
  private crudInvoices = inject(CrudInvoices);
  private crudJournals = inject(CrudJournals);
  private crudAccounts = inject(CrudAccounts);
  private crudCurrencies = inject(CrudCurrencies);
  private crudContacts = inject(CrudContacts);
  private crudTaxes = inject(CrudTaxes);
  private crudPaymentTerms = inject(CrudPaymentTerms);
  private crudDiscounts = inject(CrudDiscounts);
  private crudProducts = inject(CrudProducts);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  invoiceResource = this.crudInvoices.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  journalsResource = this.crudJournals.get({});
  accountsResource = this.crudAccounts.get({});
  currenciesResource = this.crudCurrencies.get({});
  contactsResource = this.crudContacts.get({});
  taxesResource = this.crudTaxes.get({});
  paymentTermsResource = this.crudPaymentTerms.get({});
  discountsResource = this.crudDiscounts.get({});
  productsResource = this.crudProducts.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () =>
      this.invoiceResource.isLoading() ||
      this.journalsResource.isLoading() ||
      this.accountsResource.isLoading() ||
      this.currenciesResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.taxesResource.isLoading() ||
      this.paymentTermsResource.isLoading() ||
      this.discountsResource.isLoading() ||
      this.productsResource.isLoading(),
  );
  isSubmitLoading = signal(false);
  isPosting = signal(false);
  isCancelling = signal(false);

  form = this.formService.form;
  journals = this.journalsResource.value;
  accounts = this.accountsResource.value;
  currencies = this.currenciesResource.value;
  contacts = this.contactsResource.value;
  taxes = this.taxesResource.value;
  paymentTerms = this.paymentTermsResource.value;
  discounts = this.discountsResource.value;
  products = this.productsResource.value;

  invoiceState = computed(() => (this.invoiceResource.value() as any)?.status ?? 'draft');
  invoiceNumber = computed(() => (this.invoiceResource.value() as any)?.number ?? '');
  canPost = computed(() => this.isUpdate() && this.invoiceState() === 'draft');
  canCancel = computed(() => this.isUpdate() && this.invoiceState() !== 'cancel');
  isReadOnly = computed(() => this.isUpdate() && this.invoiceState() !== 'draft');

  get lines(): FormGroup[] {
    return this.formService.lines;
  }

  private linesValue = toSignal(
    this.formService.linesArray.valueChanges,
    { initialValue: this.formService.linesArray.value },
  );

  untaxedTotal = computed(() =>
    this.linesValue()
      .filter((l: any) => !l.lineType || l.lineType === 'product')
      .reduce((sum: number, l: any) => sum + (l.quantity ?? 1) * (l.unitPrice ?? 0), 0),
  );

  taxTotal = computed(() => {
    let total = 0;
    this.linesValue()
      .filter((l: any) => !l.lineType || l.lineType === 'product')
      .forEach((l: any) => {
        const lineAmount = (l.quantity ?? 1) * (l.unitPrice ?? 0);
        const taxIds: string[] = l.taxIds ?? [];
        const lineTaxes = (this.taxes() ?? []).filter((t: any) => taxIds.includes(t._id));
        lineTaxes.forEach((t: any) => {
          total += lineAmount * ((t.percentage ?? 0) / 100);
        });
      });
    return total;
  });

  grandTotal = computed(() => this.untaxedTotal() + this.taxTotal());

  jeDebitTotal = computed(() =>
    this.linesValue().reduce((s: number, l: any) => s + (l.debit ?? 0), 0),
  );

  jeCreditTotal = computed(() =>
    this.linesValue().reduce((s: number, l: any) => s + (l.credit ?? 0), 0),
  );

  jeIsBalanced = computed(() =>
    Math.abs(this.jeDebitTotal() - this.jeCreditTotal()) < 0.001,
  );

  isProductLine(g: FormGroup): boolean {
    return this.formService.isProductLine(g);
  }

  addLine() {
    this.formService.addLine();
  }

  removeLine(index: number) {
    this.formService.removeLine(index);
  }

  getAccountName(accountId: string): string {
    const acc = (this.accounts() ?? []).find((a: any) => a._id === accountId);
    return (acc as any)?.name ?? '';
  }

  onProductChange(absoluteIndex: number, productId: string) {
    const product = (this.products() ?? []).find((p: any) => p._id === productId);
    if (!product) return;
    (this.formService.linesArray.at(absoluteIndex) as FormGroup).patchValue({
      description: product.name,
      unitPrice: product.salePrice ?? 0,
    });
  }

  onPaymentTermChange(paymentTermId: string) {
    const invoiceDate = this.form.get('invoiceDate')?.value;
    if (!invoiceDate || !paymentTermId) return;
    const pt = (this.paymentTerms() ?? []).find((p: any) => p._id === paymentTermId);
    if (!pt || !pt.lines || pt.lines.length === 0) return;
    const dueDays = pt.lines[0].dueDays ?? 0;
    const due = new Date(invoiceDate);
    due.setDate(due.getDate() + dueDays);
    this.form.patchValue({ dueDate: due });
  }

  constructor() {
    effect(() => {
      const entry = this.invoiceResource.value() as any;
      if (entry) {
        this.formService.patchValue({
          contactId: (entry.contactId as any)?._id ?? entry.contactId ?? '',
          paymentTermId: (entry.paymentTermId as any)?._id ?? entry.paymentTermId ?? '',
          invoiceDate: entry.date ? new Date(entry.date) : null,
          dueDate: entry.dueDate ? new Date(entry.dueDate) : null,
          journalId: (entry.journalId as any)?._id ?? entry.journalId ?? '',
          paymentReference: entry.paymentReference ?? '',
          currencyId: (entry.currencyId as any)?._id ?? entry.currencyId ?? '',
          lines: (entry.lines ?? []).map((l: any) => ({
            lineType: l.lineType ?? 'product',
            productId: (l.productId as any)?._id ?? l.productId ?? '',
            description: l.description ?? '',
            accountId: (l.accountId as any)?._id ?? l.accountId ?? '',
            quantity: l.quantity ?? 1,
            unitPrice: l.unitPrice ?? 0,
            taxIds: (l.taxIds ?? []).map((t: any) => t._id ?? t),
            discountId: (l.discountId as any)?._id ?? l.discountId ?? '',
            debit: l.debit ?? 0,
            credit: l.credit ?? 0,
          })),
        });
        (this.form as any).patchValue({
          crEinvoiceType: entry.crEinvoiceType ?? '',
          crCondicionVentaId: (entry.crCondicionVentaId as any)?._id ?? entry.crCondicionVentaId ?? '',
          crMedioPagoId: (entry.crMedioPagoId as any)?._id ?? entry.crMedioPagoId ?? '',
          crPlazoCredito: entry.crPlazoCredito ?? null,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
        this.formService.addLine();
      }
    });
  }

  handleSubmit(_state: FormValueState<InvoiceFormModel>) {
    if (this.form.invalid || this.isSubmitLoading()) return;
    this.isSubmitLoading.set(true);

    const val = this.form.getRawValue() as any;
    const lines = (val.lines ?? []).map((v: any) => ({
      lineType: v.lineType || 'product',
      productId: v.productId || undefined,
      description: v.description || undefined,
      accountId: v.accountId,
      quantity: v.quantity ?? 1,
      unitPrice: v.unitPrice ?? 0,
      taxIds: v.taxIds ?? [],
      discountId: v.discountId || undefined,
      debit: v.debit ?? 0,
      credit: v.credit ?? 0,
    }));

    const payload = {
      contactId: val.contactId || undefined,
      paymentTermId: val.paymentTermId || undefined,
      invoiceDate: val.invoiceDate ? (val.invoiceDate as Date).toISOString() : '',
      dueDate: val.dueDate ? (val.dueDate as Date).toISOString() : undefined,
      journalId: val.journalId,
      paymentReference: val.paymentReference || undefined,
      currencyId: val.currencyId,
      lines,
      crEinvoiceType: val.crEinvoiceType || undefined,
      crCondicionVentaId: val.crCondicionVentaId || undefined,
      crMedioPagoId: val.crMedioPagoId || undefined,
      crPlazoCredito: val.crPlazoCredito != null ? val.crPlazoCredito : undefined,
    };

    if (this.isUpdate()) {
      this.crudInvoices
        .put({ _id: this.id(), data: payload as any })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitLoading.set(false);
            this.invoiceResource.reload();
          },
          error: () => this.isSubmitLoading.set(false),
        });
    } else {
      this.crudInvoices
        .post({ data: payload as any })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.isSubmitLoading.set(false);
            const id = (res as any)?._id;
            if (id) this.router.navigate(['/accounting/invoices/edit', id]);
          },
          error: () => this.isSubmitLoading.set(false),
        });
    }
  }

  postInvoice() {
    if (this.isPosting()) return;
    this.isPosting.set(true);
    this.crudInvoices
      .postInvoice(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isPosting.set(false);
          this.invoiceResource.reload();
        },
        error: () => this.isPosting.set(false),
      });
  }

  cancelInvoice() {
    if (this.isCancelling()) return;
    this.isCancelling.set(true);
    this.crudInvoices
      .cancelInvoice(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isCancelling.set(false);
          this.invoiceResource.reload();
        },
        error: () => this.isCancelling.set(false),
      });
  }

  goBack() {
    this.router.navigate(['/accounting/invoices']);
  }
}
