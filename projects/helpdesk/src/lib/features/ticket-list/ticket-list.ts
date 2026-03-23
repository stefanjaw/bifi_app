import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudTickets } from '../../services/crud-tickets';
import { ticketColumns } from '../../libraries/ticket-columns';
import { ticketFilters } from '../../libraries/ticket-filters';
import { ticket } from '../../interfaces/ticket';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-ticket-list',
  providers: [provideResourceManager(CrudTickets)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './ticket-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketList {
  private resourceManager = inject<ResourceManager<ticket>>(ResourceManager);
  private crudTickets = inject(CrudTickets);
  private destroy$ = inject(DestroyRef);

  columns = ticketColumns;
  filters = ticketFilters;
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
}
