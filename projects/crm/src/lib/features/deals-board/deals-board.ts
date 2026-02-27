import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CrudCrm } from '../../services/crud-crm';
import { CrudCrmStages, crmStage } from '../../modules/crm-stages';
import { crm } from '../../interfaces/crm';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-deals-board',
  host: {
    class: 'flex flex-col h-full',
  },
  imports: [CurrencyPipe, DatePipe, RouterLink, ProgressBarModule],
  templateUrl: './deals-board.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsBoard {
  private crudCrm = inject(CrudCrm);
  private crudCrmStages = inject(CrudCrmStages);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  allDeals = this.crudCrm.get({});
  stagesResource = this.crudCrmStages.get({});

  deals = computed(() => (this.allDeals.value() as crm[]) ?? []);
  stages = computed(() => {
    const raw = this.stagesResource.value() as crmStage[] | null;
    if (!raw) return [];
    return [...raw].sort((a, b) => a.order - b.order);
  });

  stagesLoading = this.stagesResource.isLoading;

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
        .subscribe({
          next: () => this.allDeals.reload(),
        });
    }

    this.draggedDeal.set(null);
    this.draggedOverStage.set(null);
  }

  onDragEnd() {
    this.draggedDeal.set(null);
    this.draggedOverStage.set(null);
  }

  editDeal(deal: crm) {
    this.router.navigate(['/crm/edit', deal._id]);
  }
}
