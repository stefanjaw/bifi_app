import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  ButtonsActions,
  FilterBar,
  ListStateManager,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudCrm } from '../../services/crud-crm';
import { CrudCrmStages } from '../../modules/crm-stages/services/crud-crm-stages';
import { crmStage } from '../../modules/crm-stages/interfaces/crm-stage';
import { crm } from '../../interfaces/crm';
import { crmColumns } from '../../libraries/crm-columns';
import { crmFilterFields, crmFilters } from '../../libraries/crm-filters';
import { CrudSalesOrders } from '../../services/crud-sales-orders';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HasPermission } from '@avalantec/base-app/auth';
import { SalesPipeline } from '../sales-pipeline/sales-pipeline';

const VIEW_KEY = 'sales.opportunitiesView';

@Component({
  selector: 'bifi-app-opportunities-list',
  providers: [ListStateManager, ...provideResourceManager(CrudCrm)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    TableLayout,
    SearchBar,
    FilterBar,
    ButtonModule,
    RouterLink,
    ToastModule,
    HasPermission,
    ButtonsActions,
    SalesPipeline,
  ],
  templateUrl: './opportunities-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesList {
  private resourceManager = inject<ResourceManager<crm>>(ResourceManager);
  private crudCrm = inject(CrudCrm);
  private crudCrmStages = inject(CrudCrmStages);
  private crudSalesOrders = inject(CrudSalesOrders);
  private messageService = inject(MessageService);
  private destroy$ = inject(DestroyRef);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  viewMode = signal<'list' | 'kanban'>(
    (localStorage.getItem(VIEW_KEY) as 'list' | 'kanban') ?? 'list'
  );

  setView(mode: 'list' | 'kanban') {
    this.viewMode.set(mode);
    localStorage.setItem(VIEW_KEY, mode);
  }

  stagesResource = this.crudCrmStages.get({});
  stages = computed(() => (this.stagesResource.value() as crmStage[]) ?? []);

  wonStage = computed(() => this.stages().find(s => s.isWon));
  lostStage = computed(() => this.stages().find(s => s.isLost));

  crmColumns = crmColumns;
  crmFilters = crmFilters;
  filterFields = crmFilterFields;

  entries = this.resourceManager.data;

  markingId = signal<string | null>(null);

  editOpportunity = (element: crm) => {
    this.router.navigate(['../opportunities/edit', element._id], { relativeTo: this.route });
  };

  markWon(event: Event, deal: crm) {
    event.stopPropagation();
    const wonStage = this.wonStage();
    if (!wonStage) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No won stage',
        detail: 'Configure a "Won" stage in Deal Stages settings first.',
      });
      return;
    }
    this.markingId.set(deal._id);
    this.crudCrm
      .put({ _id: deal._id, data: { stage: wonStage._id } as any })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          const salespersonId = (deal as any).salesperson?._id;
          const orderPayload: Record<string, any> = {
            crmId: deal._id,
            contact: deal.contact?._id,
            company: deal.company?._id,
            amount: deal.amount,
            currency: deal.currency,
            closeDate: new Date().toISOString(),
          };
          if (salespersonId) orderPayload['salesperson'] = salespersonId;
          if (deal.notes) orderPayload['notes'] = deal.notes;

          this.crudSalesOrders
            .post({ data: orderPayload as any })
            .pipe(takeUntilDestroyed(this.destroy$))
            .subscribe({
              next: () => {
                this.markingId.set(null);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Deal Won',
                  detail: 'Deal marked as won and sales order created.',
                });
                this.entries.reload();
              },
              error: () => {
                this.markingId.set(null);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create sales order.',
                });
              },
            });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update stage.',
          });
          this.markingId.set(null);
        },
      });
  }

  markLost(event: Event, deal: crm) {
    event.stopPropagation();
    const lostStage = this.lostStage();
    if (!lostStage) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No lost stage',
        detail: 'Configure a "Lost" stage in Deal Stages settings first.',
      });
      return;
    }
    this.markingId.set(deal._id);
    this.crudCrm
      .put({ _id: deal._id, data: { stage: lostStage._id } as any })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.markingId.set(null);
          this.messageService.add({
            severity: 'info',
            summary: 'Deal Lost',
            detail: 'Deal marked as lost.',
          });
          this.entries.reload();
        },
        error: () => {
          this.markingId.set(null);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update stage.',
          });
        },
      });
  }

  deleteEntry(id: string) {
    this.crudCrm
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.entries.reload();
        },
      });
  }
}
