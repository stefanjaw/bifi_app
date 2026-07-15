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
import {
  PurchaseOrderForm as PurchaseOrderFormService,
  PurchaseOrderFormModel,
} from '../../services/purchase-order-form';
import { CrudPurchaseOrders } from '../../services/crud-purchase-orders';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { LineItemsTable } from '../../components/line-items-table/line-items-table';
import { SelectContactDialog } from '../../components/select-contact-dialog/select-contact-dialog';
import { lineItem } from '../../interfaces/line-item';
import { purchaseOrderStatus } from '../../interfaces/purchase-order';
import { contact } from '@avalantec/base-app/interfaces';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudPurchaseStages } from '../../modules/purchase-stages/services/crud-purchase-stages';
import { purchaseStage } from '../../modules/purchase-stages/interfaces/purchase-stage';
import { CrudTaxes } from '@avalantec/base-app/taxes';
import { DynamicBreadcrumbService } from '@avalantec/base-app/core';
import { CrudDiscounts } from '@avalantec/accounting';
import { CrudProducts } from '@avalantec/inventory';
import { HasPermission } from '@avalantec/base-app/auth';
import { calculateTotalsPerLine, TotalsPreview } from '../../utils/price-calculator';
import { LocaleDatePipe, TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-purchase-order-detail',
  imports: [
    DecimalPipe,
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    TooltipModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
    ProgressBarModule,
    TagModule,
    LineItemsTable,
    SelectContactDialog,
    HasPermission,
    TranslatePipe,
    LocaleDatePipe,
  ],
  templateUrl: './purchase-order-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrderDetail {
  private formService = inject(PurchaseOrderFormService);
  private crudPurchaseOrders = inject(CrudPurchaseOrders);
  private crudContacts = inject(CrudContacts);
  private crudPurchaseStages = inject(CrudPurchaseStages);
  private crudTaxes = inject(CrudTaxes);
  private crudDiscounts = inject(CrudDiscounts);
  private crudProducts = inject(CrudProducts);
  private dynamicBreadcrumb = inject(DynamicBreadcrumbService);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translationService = inject(TranslationService);

  id = input<string>('');

  orderResource = this.crudPurchaseOrders.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  contactsResource = this.crudContacts.get({});
  stagesResource = this.crudPurchaseStages.get({});
  taxesResource = this.crudTaxes.get({});
  discountsResource = this.crudDiscounts.get({});
  productsResource = this.crudProducts.get({});

  private _selectedContact = signal<contact | null>(null);

  entry = this.orderResource.value;

  contactOptions = computed(() => {
    const all = (this.contactsResource.value() as contact[]) ?? [];
    const slice = all.slice(0, 10);
    const sel = this._selectedContact();
    if (sel && !slice.find(c => c._id === sel._id)) {
      return [sel, ...slice];
    }
    return slice;
  });

  stageOptions = computed(() => (this.stagesResource.value() as purchaseStage[]) ?? []);

  defaultStageId = computed(() => this.stageOptions().find(s => s.isDefault)?._id ?? '');

  purchaseTaxOptions = computed(() =>
    ((this.taxesResource.value() as any[]) ?? []).filter(
      (t: any) => t?.active === true && t?.taxType === 'purchase'
    )
  );

  discountOptions = computed(() =>
    ((this.discountsResource.value() as any[]) ?? []).filter((d: any) => d?.active !== false)
  );

  productOptions = computed(() => (this.productsResource.value() as any[]) ?? []);

  isLoading = computed(
    () =>
      this.orderResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.taxesResource.isLoading() ||
      this.discountsResource.isLoading() ||
      this.productsResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isPdfLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  lineItems = signal<lineItem[]>([]);

  totalsPreview = computed<TotalsPreview>(() => {
    const items = this.lineItems();
    const lineTaxIds = items.map(item => item.taxIds ?? []);
    const allTaxes = this.purchaseTaxOptions();
    const allDiscounts = this.discountOptions();
    const discountedPrices = items.map((item: lineItem) => {
      const discountId = item.discountId;
      const discount = discountId ? allDiscounts.find((d: any) => d._id === discountId) : null;
      if (!discount) return Number(item.unitPrice ?? 0);
      return discount.discountType === 'percentage'
        ? Number(item.unitPrice ?? 0) * (1 - discount.value / 100)
        : Math.max(0, Number(item.unitPrice ?? 0) - discount.value);
    });
    return calculateTotalsPerLine(items, lineTaxIds, allTaxes, discountedPrices);
  });

  form = this.formService.form;

  statusOptions = [
    { label: this.translationService.translate('status.draft', {}, 'purchases'), value: 'draft' },
    {
      label: this.translationService.translate('status.confirmed', {}, 'purchases'),
      value: 'confirmed',
    },
    { label: this.translationService.translate('status.sent', {}, 'purchases'), value: 'sent' },
    {
      label: this.translationService.translate('status.partiallyReceived', {}, 'purchases'),
      value: 'partially_received',
    },
    {
      label: this.translationService.translate('status.received', {}, 'purchases'),
      value: 'received',
    },
    {
      label: this.translationService.translate('status.cancelled', {}, 'purchases'),
      value: 'cancelled',
    },
  ];

  readonly today = new Date();

  statusLabel = computed(() => {
    const status = this.entry()?.status ?? '';
    return status ? this.translationService.translate('status.' + status, {}, 'purchases') : '';
  });

  statusSteps = computed(() => {
    const status = this.entry()?.status ?? 'draft';
    const isCancelled = status === 'cancelled';
    const isPartiallyReceived = status === 'partially_received';
    const normalizedStatus = isPartiallyReceived ? 'received' : status;

    const steps = [
      { key: 'draft', label: this.translationService.translate('status.draft', {}, 'purchases') },
      {
        key: 'confirmed',
        label: this.translationService.translate('status.confirmed', {}, 'purchases'),
      },
      { key: 'sent', label: this.translationService.translate('status.sent', {}, 'purchases') },
      {
        key: 'received',
        label: this.translationService.translate(
          isPartiallyReceived ? 'status.partiallyReceived' : 'status.received',
          {},
          'purchases'
        ),
      },
    ];

    const activeIndex = isCancelled ? -1 : steps.findIndex(s => s.key === normalizedStatus);

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
      if (id && entry?.poNumber) {
        this.dynamicBreadcrumb.set(id, entry.poNumber);
      }
    });

    this.destroy$.onDestroy(() => {
      const id = this.id();
      if (id) this.dynamicBreadcrumb.clear(id);
    });

    effect(() => {
      const entry = this.entry();
      if (entry) {
        const contactData = entry.contactId as any;
        const contactId = contactData?._id ?? contactData ?? '';
        if (contactData && typeof contactData === 'object') {
          this._selectedContact.set(contactData as contact);
        }
        const stageData = entry.stageId as any;
        const stageId = stageData?._id ?? stageData ?? null;
        this.formService.patchValue({
          contactId,
          status: entry.status,
          issueDate: entry.issueDate || '',
          expectedDeliveryDate: entry.expectedDeliveryDate || '',
          notes: entry.notes || '',
          stageId,
        });
        const rawLineItems = (entry.lineItems ?? []) as any[];
        this.lineItems.set(
          rawLineItems.map((item: any) => {
            const rawTaxIds: any[] = Array.isArray(item.taxIds) ? item.taxIds : [];
            const taxIds: string[] = rawTaxIds
              .map((id: any) => {
                if (!id) return '';
                if (typeof id === 'string') return id;
                if (typeof id === 'object') return (id._id ?? id.$oid ?? '').toString();
                return String(id);
              })
              .filter(Boolean);
            return {
              productId:
                typeof item.productId === 'object'
                  ? (item.productId?._id ?? undefined)
                  : (item.productId ?? undefined),
              description: item.description ?? '',
              quantity: item.quantity ?? 1,
              unitPrice: item.unitPrice ?? 0,
              total: item.total ?? 0,
              taxIds,
              discountId:
                typeof item.discountId === 'object'
                  ? (item.discountId?._id ?? undefined)
                  : (item.discountId ?? undefined),
            };
          })
        );
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
        this.lineItems.set([]);
        this._selectedContact.set(null);
        const preselected = this.route.snapshot.queryParamMap.get('contactId');
        if (preselected) {
          this.formService.patchValue({ contactId: preselected });
        }
        const defStage = this.defaultStageId();
        if (defStage) {
          this.formService.patchValue({ stageId: defStage });
        }
      }
    });
  }

  onContactSelected(selectedContact: contact) {
    this._selectedContact.set(selectedContact);
    this.formService.patchValue({ contactId: selectedContact._id });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onLineItemsChange(items: lineItem[]) {
    this.lineItems.set(items);
    this.form.markAsDirty();
  }

  markAsConfirmed() {
    if (!this.id()) return;
    this.crudPurchaseOrders
      .updateStatus(this.id(), 'confirmed')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.orderResource.reload() });
  }

  markAsSent() {
    if (!this.id()) return;
    this.crudPurchaseOrders
      .updateStatus(this.id(), 'sent')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.orderResource.reload() });
  }

  markAsReceived() {
    if (!this.id()) return;
    this.crudPurchaseOrders
      .updateStatus(this.id(), 'received')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => this.orderResource.reload(),
      });
  }

  markAsPartiallyReceived() {
    if (!this.id()) return;
    this.crudPurchaseOrders
      .updateStatus(this.id(), 'partially_received')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => this.orderResource.reload(),
      });
  }

  cancelOrder() {
    if (!this.id()) return;
    this.crudPurchaseOrders
      .updateStatus(this.id(), 'cancelled')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => this.orderResource.reload(),
      });
  }

  exportPdf() {
    if (!this.id() || this.isPdfLoading()) return;
    this.isPdfLoading.set(true);
    this.crudPurchaseOrders
      .downloadPdf(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => this.isPdfLoading.set(false),
        error: () => this.isPdfLoading.set(false),
      });
  }

  handleSubmit(data: FormValueState<PurchaseOrderFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const payload = {
      contactId: rawValue.contactId,
      status: rawValue.status as purchaseOrderStatus,
      issueDate: rawValue.issueDate ? new Date(rawValue.issueDate).toISOString() : undefined,
      expectedDeliveryDate: rawValue.expectedDeliveryDate
        ? new Date(rawValue.expectedDeliveryDate).toISOString()
        : undefined,
      lineItems: this.lineItems().map(item => ({
        ...item,
        discountId: item.discountId || null,
      })),
      notes: rawValue.notes,
      stageId: rawValue.stageId || undefined,
    };

    if (this.isUpdate()) {
      this.crudPurchaseOrders
        .put({ _id: this.id(), data: payload as Record<string, any> })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitLoading.set(false);
            this.orderResource.reload();
          },
          error: () => this.isSubmitLoading.set(false),
        });
    } else {
      this.crudPurchaseOrders
        .post({ data: payload as Record<string, any> })
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
