import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  FilterBar,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudTickets } from '../../services/crud-tickets';
import { ticketColumns } from '../../libraries/ticket-columns';
import { ticketFilterFields, ticketFilters } from '../../libraries/ticket-filters';
import { ticket } from '../../interfaces/ticket';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-ticket-list',
  providers: [provideResourceManager(CrudTickets)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, FilterBar, ButtonModule, HasPermission, RouterLink, ButtonsActions],
  templateUrl: './ticket-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketList {
  private resourceManager = inject<ResourceManager<ticket>>(ResourceManager);
  private crudTickets = inject(CrudTickets);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = ticketColumns;
  filters = ticketFilters;
  filterFields = ticketFilterFields;
  tickets = this.resourceManager.data;

  deleteTicket(id: string) {
    this.crudTickets
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.tickets.reload();
        },
      });
  }

  gotoEditTicket = (element: ticket) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  }
}
