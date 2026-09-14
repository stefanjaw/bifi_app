import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
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
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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
import { ColWidthManager } from '@avalantec/base-app/core';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { LocaleDatePipe } from '@avalantec/base-app/i18n';

const INVOICE_DEFAULT_WIDTHS: Record<string, number> = {
  product: 96,
  description: 240,
  account: 180,
  quantity: 128,
  unitPrice: 128,
  taxes: 160,
  amount: 112,
};

@Component({
  selector: 'bifi-app-invoice-form',
  imports: [
    FormModule,
    PluginSlot,
    ReactiveFormsModule,
    FormsModule,
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
    TranslatePipe,
    LocaleDatePipe,
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
  private location = inject(Location);
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
      this.productsResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isPosting = signal(false);
  isCancelling = signal(false);
  isCreatingCreditNote = signal(false);

  creditNoteUrl = signal<string | null>(null);

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
  isCreditNote = computed(() => !!(this.invoiceResource.value() as any)?.isCreditNote);
  canCreateCreditNote = computed(
    () =>
      this.isUpdate() &&
      this.invoiceState() === 'posted' &&
      this.invoiceAmountDue() > 0 &&
      !this.isCreditNote()
  );

  // ---- Payments (Phase 2: register settlement payments against invoices) ----
  payments = signal<any[]>([]);
  paymentsLoading = signal<boolean>(false);
  isRegisteringPayment = signal<boolean>(false);
  settlementAmount = signal<number | null>(null);
  settlementJournalId = signal<string>('');
  settlementPaymentDate = signal<Date>(new Date());
  settlementReference = signal<string>('');

  // ---- Installment schedule (Phase 3 / B5: multi-due-date payment terms) ----
  dueDateEntries = signal<{ amount: number; date: Date }[]>([]);

  invoiceAmountDue = computed(() => (this.invoiceResource.value() as any)?.amountDue ?? 0);
  invoiceTotal = computed(() => (this.invoiceResource.value() as any)?.totalAmount ?? 0);
  invoiceCurrencyId = computed(() => {
    const cur = (this.invoiceResource.value() as any)?.currencyId;
    return cur?._id ?? cur ?? '';
  });
  canRegisterPayment = computed(
    () => this.isUpdate() && this.invoiceState() === 'posted' && this.invoiceAmountDue() > 0
  );

  private cwm = new ColWidthManager(INVOICE_DEFAULT_WIDTHS, 'lineItems.invoice.colWidths');
  colWidths = this.cwm.colWidths;

  onResizeStart(event: MouseEvent, colKey: string) {
    this.cwm.onResizeStart(event, colKey);
  }

  @HostListener('document:mousemove', ['$event'])
  onResizeMove(event: MouseEvent) {
    this.cwm.onResizeMove(event);
  }

  @HostListener('document:mouseup')
  onResizeEnd() {
    this.cwm.onResizeEnd();
  }

  get lines(): FormGroup[] {
    return this.formService.lines;
  }

  private linesValue = toSignal(this.formService.linesArray.valueChanges, {
    initialValue: this.formService.linesArray.value,
  });

  untaxedTotal = computed(() =>
    this.linesValue()
      .filter((l: any) => !l.lineType || l.lineType === 'product')
      .reduce((sum: number, l: any) => sum + (l.quantity ?? 1) * (l.unitPrice ?? 0), 0)
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
    this.linesValue().reduce((s: number, l: any) => s + (l.debit ?? 0), 0)
  );

  jeCreditTotal = computed(() =>
    this.linesValue().reduce((s: number, l: any) => s + (l.credit ?? 0), 0)
  );

  jeIsBalanced = computed(() => Math.abs(this.jeDebitTotal() - this.jeCreditTotal()) < 0.001);

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

  /**
   * Recomputes the full installment schedule whenever the payment term (or
   * the invoice date) changes, using each line's `percentage`/`dueDays`.
   * The `dueDate` control keeps the latest installment date.
   * @param paymentTermId - Selected payment term ID
   */
  onPaymentTermChange(paymentTermId: string) {
    const invoiceDate = this.form.get('invoiceDate')?.value;
    if (!invoiceDate || !paymentTermId) return;
    const pt = (this.paymentTerms() ?? []).find((p: any) => p._id === paymentTermId);
    if (!pt || !pt.lines || pt.lines.length === 0) return;
    const base = new Date(invoiceDate);
    const addDays = (days: number) => {
      const due = new Date(base);
      due.setDate(due.getDate() + (days ?? 0));
      return due;
    };
    const entries = (pt.lines as any[])
      .map((l: any) => ({ dueDays: l.dueDays ?? 0, percentage: l.percentage ?? 0 }))
      .sort((a: any, b: any) => a.dueDays - b.dueDays);
    const totalValue = this.grandTotal() || 0;
    const schedule =
      entries.length === 1 && (entries[0].percentage === 0 || entries[0].percentage >= 100)
        ? [{ amount: Math.round(totalValue * 100) / 100, date: addDays(entries[0].dueDays) }]
        : entries.map((e: any) => ({
            amount: Math.round(totalValue * (e.percentage / 100) * 100) / 100,
            date: addDays(e.dueDays),
          }));
    this.dueDateEntries.set(schedule);
    this.form.patchValue({ dueDate: schedule[schedule.length - 1].date });
  }

  constructor() {
    effect(() => {
      const entry = this.invoiceResource.value() as any;

      // ---- Hydrate the form from the loaded invoice ----
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
        this.formService.resetDirtyState();
        this.settlementAmount.set(typeof entry.amountDue === 'number' ? entry.amountDue : null);
        this.dueDateEntries.set(
          (entry.dueDates ?? []).map((d: any) => ({
            amount: d.amount ?? 0,
            date: new Date(d.date),
          }))
        );
        this.loadPayments();

        // ---- Create mode: leave the form empty with one line ----
      } else if (!this.isUpdate()) {
        this.formService.reset();
        this.formService.addLine();
      }
    });
  }

  /**
   * Fetches the payments registered against this invoice
   */
  loadPayments() {
    if (!this.isUpdate()) return;
    this.paymentsLoading.set(true);
    this.crudInvoices
      .getPayments(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          this.payments.set(res ?? []);
          this.paymentsLoading.set(false);
        },
        error: () => this.paymentsLoading.set(false),
      });
  }

  /**
   * Registers a settlement payment against the invoice via the backend
   * (which also creates the relieving journal entry) and refreshes state
   */
  registerInvoicePayment() {
    // ---- [1] Local validation and posting flag ----
    const amount = this.settlementAmount();
    if (!amount || amount <= 0 || !this.settlementJournalId()) return;
    if (this.isRegisteringPayment()) return;
    this.isRegisteringPayment.set(true);
    const journalId = this.settlementJournalId();
    const currencyId = this.invoiceCurrencyId();

    // ---- [2] Send to the backend (it also creates the settlement JE) ----
    this.crudInvoices
      .registerPayment(this.id(), {
        amount,
        paymentDate: this.settlementPaymentDate().toISOString(),
        journalId,
        currencyId,
        reference: this.settlementReference() || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        // ---- [3] Reset the register form and refresh invoice + payments ----
        next: () => {
          this.isRegisteringPayment.set(false);
          this.settlementAmount.set(null);
          this.settlementReference.set('');
          this.loadPayments();
          this.invoiceResource.reload();
        },
        error: () => this.isRegisteringPayment.set(false),
      });
  }

  handleSubmit(_state: FormValueState<InvoiceFormModel>) {
    if (this.form.invalid || this.isSubmitLoading()) return;
    this.isSubmitLoading.set(true);

    const val = this.form.getRawValue() as any;

    // ---- [1] Clean up the raw value before sending ----
    // in case contactId is empty, delete it
    if (!val.contactId || val.contactId === '') delete val.contactId;

    // ---- [2] Normalize line rows (default type/products/decimals) ----
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
      ...val,
      invoiceDate: val.invoiceDate ? (val.invoiceDate as Date).toISOString() : '',
      dueDate: val.dueDate ? (val.dueDate as Date).toISOString() : undefined,
      lines,
    };

    // ---- [3] Update (reload invoice) vs create (navigate to edit) ----
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

  /**
   * Creates a credit note against this invoice and navigates to its editor
   */
  createCreditNote() {
    if (this.isCreatingCreditNote()) return;
    this.isCreatingCreditNote.set(true);
    this.crudInvoices
      .createCreditNote(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isCreatingCreditNote.set(false);
          const newId = res?._id;
          if (newId) this.router.navigate(['/accounting/invoices/edit', newId]);
          else this.invoiceResource.reload();
        },
        error: () => this.isCreatingCreditNote.set(false),
      });
  }

  goBack() {
    this.location.back();
  }
}
