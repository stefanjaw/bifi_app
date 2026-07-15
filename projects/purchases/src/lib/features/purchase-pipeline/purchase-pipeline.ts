import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CrudPurchaseOrders } from '../../services/crud-purchase-orders';
import { CrudPurchaseStages } from '../../modules/purchase-stages/services/crud-purchase-stages';
import { purchaseOrder } from '../../interfaces/purchase-order';
import { purchaseStage } from '../../modules/purchase-stages/interfaces/purchase-stage';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { injectAuthService } from '@avalantec/base-app/auth';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-purchase-pipeline',
  host: {
    class: 'flex flex-col h-full',
  },
  imports: [CurrencyPipe, ProgressBarModule, TagModule, TranslatePipe],
  templateUrl: './purchase-pipeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasePipeline {
  private crudPurchaseOrders = inject(CrudPurchaseOrders);
  private crudPurchaseStages = inject(CrudPurchaseStages);
  private router = inject(Router);
  private auth = injectAuthService();
  private destroy$ = inject(DestroyRef);
  private translationService = inject(TranslationService);

  ordersResource = this.crudPurchaseOrders.get({ getInactive: null });
  stagesResource = this.crudPurchaseStages.get({});

  orders = computed(() => (this.ordersResource.value() as purchaseOrder[]) ?? []);
  stages = computed(() => {
    const raw = (this.stagesResource.value() as purchaseStage[]) ?? [];
    return [...raw].sort((a, b) => a.order - b.order);
  });

  isLoading = computed(() => this.ordersResource.isLoading() || this.stagesResource.isLoading());

  draggedOrder = signal<purchaseOrder | null>(null);
  draggedOverColumn = signal<string | null>(null);

  getOrdersByStage(stageId: string | null): purchaseOrder[] {
    return this.orders().filter(o => {
      const oStageId = (o.stageId as any)?._id ?? o.stageId ?? null;
      return stageId === null ? !oStageId : oStageId === stageId;
    });
  }

  getTotalValue(stageId: string | null): number {
    return this.getOrdersByStage(stageId).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      draft: 'secondary',
      sent: 'info',
      partially_received: 'warn',
      received: 'success',
      cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }

  getStatusLabel(status: string): string {
    return this.translationService.translate('status.' + status, {}, 'purchases');
  }

  onDragStart(event: DragEvent, order: purchaseOrder) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', order._id);
      event.dataTransfer.effectAllowed = 'move';
    }
    this.draggedOrder.set(order);
  }

  onDragOver(event: DragEvent, columnId: string | null) {
    event.preventDefault();
    this.draggedOverColumn.set(columnId ?? 'unassigned');
  }

  onDragLeave() {
    this.draggedOverColumn.set(null);
  }

  onDrop(event: DragEvent, stageId: string | null) {
    event.preventDefault();
    const order = this.draggedOrder();

    if (order) {
      const currentStageId = (order.stageId as any)?._id ?? order.stageId ?? null;
      if (currentStageId !== stageId) {
        this.crudPurchaseOrders
          .put({ _id: order._id, data: { stageId } as any })
          .pipe(takeUntilDestroyed(this.destroy$))
          .subscribe({
            next: () => this.ordersResource.reload(),
          });
      }
    }

    this.draggedOrder.set(null);
    this.draggedOverColumn.set(null);
  }

  onDragEnd() {
    this.draggedOrder.set(null);
    this.draggedOverColumn.set(null);
  }

  navigateToOrder(order: purchaseOrder) {
    const user = this.auth.user();
    if (!user) return;
    const hasPermission = this.auth.hasPermission({
      user,
      resource: 'purchases/orders/read' as any,
      type: 'view',
      context: {},
    });
    if (hasPermission) {
      this.router.navigate(['/purchases/orders', order._id]);
    }
  }
}
