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
import { PurchaseOrderForm as PurchaseOrderFormService, PurchaseOrderFormModel } from '../../services/purchase-order-form';
import { CrudPurchaseOrders } from '../../services/crud-purchase-orders';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
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
import { CrudTaxes } from '@avalantec/accounting';
import { CrudProducts } from '@avalantec/inventory';
import { calculateTotalsPerLine, TotalsPreview } from '../../utils/price-calculator';

@Component({
  selector: 'bifi-app-purchase-order-detail',
  imports: [
    DecimalPipe,
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
    ProgressBarModule,
    TagModule,
    LineItemsTable,
    SelectContactDialog,
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
  private crudProducts = inject(CrudProducts);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  orderResource = this.crudPurchaseOrders.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  contactsResource = this.crudContacts.get({});
  stagesResource = this.crudPurchaseStages.get({});
  taxesResource = this.crudTaxes.get({});
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

  purchaseTaxOptions = computed(() =>
    ((this.taxesResource.value() as any[]) ?? []).filter(
      (t: any) => t?.active === true && t?.taxType === 'purchase',
    ),
  );

  productOptions = computed(() => (this.productsResource.value() as any[]) ?? []);

  isLoading = computed(
    () =>
      this.orderResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.taxesResource.isLoading() ||
      this.productsResource.isLoading(),
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  lineItems = signal<lineItem[]>([]);

  totalsPreview = computed<TotalsPreview>(() => {
    const items = this.lineItems();
    const lineTaxIds = items.map(item => item.taxIds ?? []);
    const allTaxes = this.purchaseTaxOptions();
    return calculateTotalsPerLine(items, lineTaxIds, allTaxes);
  });

  form = this.formService.form;

  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Sent', value: 'sent' },
    { label: 'Partially Received', value: 'partially_received' },
    { label: 'Received', value: 'received' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  constructor() {
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
              productId: typeof item.productId === 'object'
                ? (item.productId?._id ?? undefined)
                : (item.productId ?? undefined),
              description: item.description ?? '',
              quantity: item.quantity ?? 1,
              unitPrice: item.unitPrice ?? 0,
              total: item.total ?? 0,
              taxIds,
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

  handleSubmit(data: FormValueState<PurchaseOrderFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const payload = {
      contactId: rawValue.contactId,
      status: rawValue.status as purchaseOrderStatus,
      issueDate: rawValue.issueDate ? new Date(rawValue.issueDate).toISOString() : undefined,
      expectedDeliveryDate: rawValue.expectedDeliveryDate ? new Date(rawValue.expectedDeliveryDate).toISOString() : undefined,
      lineItems: this.lineItems().map(item => ({ ...item })),
      notes: rawValue.notes,
      stageId: rawValue.stageId || null,
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
