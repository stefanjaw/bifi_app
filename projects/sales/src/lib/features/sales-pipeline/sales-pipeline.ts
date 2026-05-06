import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CrudCrm } from '../../services/crud-crm';
import { CrudCrmStages } from '../../modules/crm-stages/services/crud-crm-stages';
import { crmStage } from '../../modules/crm-stages/interfaces/crm-stage';
import { crm } from '../../interfaces/crm';
import { CrudSalesOrders } from '../../services/crud-sales-orders';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bifi-app-sales-pipeline',
  host: {
    class: 'flex flex-col h-full',
  },
  imports: [CurrencyPipe, DatePipe, RouterLink, ProgressBarModule, ButtonModule, ToastModule],
  templateUrl: './sales-pipeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesPipeline {
  private crudCrm = inject(CrudCrm);
  private crudCrmStages = inject(CrudCrmStages);
  private crudSalesOrders = inject(CrudSalesOrders);
  private messageService = inject(MessageService);
  private destroy$ = inject(DestroyRef);

  allDeals = this.crudCrm.get({});
  stagesResource = this.crudCrmStages.get({});

  deals = computed(() => (this.allDeals.value() as crm[]) ?? []);
  stages = computed(() => {
    const raw = this.stagesResource.value() as crmStage[] | null;
    if (!raw) return [];
    return [...raw].sort((a, b) => a.order - b.order);
  });

  wonStage = computed(() => this.stages().find(s => s.isWon));
  lostStage = computed(() => this.stages().find(s => s.isLost));

  stagesLoading = this.stagesResource.isLoading;
  actionLoadingId = signal<string | null>(null);

  draggedDeal = signal<crm | null>(null);
  draggedOverStage = signal<crmStage | null>(null);

  getDealsByStage(stage: crmStage): crm[] {
    return this.deals().filter(d => d.stage?._id === stage._id);
  }

  getTotalValue(stage: crmStage): number {
    return this.getDealsByStage(stage).reduce((sum, d) => sum + (d.amount || 0), 0);
  }

  onDragStart(event: DragEvent, deal: crm) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', deal._id);
      event.dataTransfer.effectAllowed = 'move';
    }
    this.draggedDeal.set(deal);
  }

  onDragOver(event: DragEvent, stage: crmStage) {
    event.preventDefault();
    this.draggedOverStage.set(stage);
  }

  onDragLeave() {
    this.draggedOverStage.set(null);
  }

  onDrop(event: DragEvent, stage: crmStage) {
    event.preventDefault();
    const deal = this.draggedDeal();
    if (deal && deal.stage?._id !== stage._id) {
      this.crudCrm
        .put({ _id: deal._id, data: { stage: stage._id } as any })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({ next: () => this.allDeals.reload() });
    }
    this.draggedDeal.set(null);
    this.draggedOverStage.set(null);
  }

  onDragEnd() {
    this.draggedDeal.set(null);
    this.draggedOverStage.set(null);
  }

  markWon(deal: crm) {
    const wonStage = this.wonStage();
    if (!wonStage) {
      this.messageService.add({ severity: 'warn', summary: 'No won stage', detail: 'Configure a "Won" stage in Deal Stages settings first.' });
      return;
    }
    this.actionLoadingId.set(deal._id);
    this.crudCrm
      .put({ _id: deal._id, data: { stage: wonStage._id } as any })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          const salespersonId = (deal as any).salesperson?._id;
          const dealCurrency = deal.currency as any;
          const currencyId = dealCurrency?._id ?? dealCurrency;
          const orderPayload: Record<string, any> = {
            crmId: deal._id,
            contact: deal.contact?._id,
            company: deal.company?._id,
            currency: currencyId,
            closeDate: new Date().toISOString(),
          };
          if (salespersonId) orderPayload['salesperson'] = salespersonId;
          if (deal.notes) orderPayload['notes'] = deal.notes;

          this.crudSalesOrders
            .post({ data: orderPayload as any })
            .pipe(takeUntilDestroyed(this.destroy$))
            .subscribe({
              next: () => {
                this.actionLoadingId.set(null);
                this.messageService.add({ severity: 'success', summary: 'Deal Won', detail: 'Sales order created.' });
                this.allDeals.reload();
              },
              error: () => {
                this.actionLoadingId.set(null);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create sales order.' });
              },
            });
        },
        error: () => {
          this.actionLoadingId.set(null);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to mark as won.' });
        },
      });
  }

  markLost(deal: crm) {
    const lostStage = this.lostStage();
    if (!lostStage) {
      this.messageService.add({ severity: 'warn', summary: 'No lost stage', detail: 'Configure a "Lost" stage in Deal Stages settings first.' });
      return;
    }
    this.actionLoadingId.set(deal._id);
    this.crudCrm
      .put({ _id: deal._id, data: { stage: lostStage._id } as any })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.actionLoadingId.set(null);
          this.messageService.add({ severity: 'info', summary: 'Deal Lost', detail: 'Deal marked as lost.' });
          this.allDeals.reload();
        },
        error: () => {
          this.actionLoadingId.set(null);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to mark as lost.' });
        },
      });
  }
}
