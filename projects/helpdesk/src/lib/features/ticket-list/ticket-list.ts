import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  ButtonsActions,
  CalendarEvent,
  CalendarView,
  FilterBar,
  ListStateManager,
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
import dayjs from 'dayjs';
import { CreateTasksFormDialog } from '@avalantec/tasks';
import { TooltipModule } from 'primeng/tooltip';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-ticket-list',
  providers: [ListStateManager, ...provideResourceManager(CrudTickets)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    TableLayout,
    SearchBar,
    FilterBar,
    ButtonModule,
    HasPermission,
    RouterLink,
    ButtonsActions,
    CalendarView,
    TooltipModule,
    CreateTasksFormDialog,
    TranslatePipe,
  ],
  templateUrl: './ticket-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketList {
  private resourceManager = inject<ResourceManager<ticket>>(ResourceManager);
  private crudTickets = inject(CrudTickets);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private listStateManager = inject(ListStateManager);

  // states
  viewState = signal<'list' | 'calendar'>('list');
  isListView = computed(() => this.viewState() === 'list');

  columns = ticketColumns;
  filters = ticketFilters;
  filterFields = ticketFilterFields;

  // data
  tickets = this.resourceManager.data;
  isLoading = this.resourceManager.data.isLoading;
  error = this.resourceManager.data.error;

  // children
  private createTasksFormDialog = viewChild(CreateTasksFormDialog);

  calendarEvents = computed<CalendarEvent[]>(() => {
    const today = new Date();
    return (
      this.tickets.value()?.docs.map(t => {
        const start = t.dateStart ? new Date(t.dateStart) : today;
        const end = t.dateEnd ? new Date(t.dateEnd) : new Date(start.getTime() + 3600000);
        return {
          id: t._id,
          title: t.name,
          start,
          end,
          color: 'blue',
        };
      }) ?? []
    );
  });

  constructor() {
    this._restoreViewState();

    effect(() => {
      const view = this.viewState();
      untracked(() => this.listStateManager.savePartialState({ view }));
    });
  }

  private _restoreViewState(): void {
    const view = this.listStateManager.pendingRestore?.view as 'list' | 'calendar' | undefined;
    if (view && ['list', 'calendar'].includes(view)) this.viewState.set(view);
  }

  onTicketDateChange(event: { id: string; start: dayjs.Dayjs | Date; end: dayjs.Dayjs | Date }) {
    this.crudTickets
      .put({
        _id: event.id,
        data: {
          dateStart: dayjs(event.start).toISOString(),
          dateEnd: dayjs(event.end).toISOString(),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: result => {
          if (result) this.tickets.reload();
        },
      });
  }

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
    // Persist list state now so it will be available on return (localStorage)
    this.resourceManager.persistStateNow();
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  createTask(ticket: ticket) {
    this.createTasksFormDialog()?.openDialog({
      name: ticket.name,
      description: ticket.description,
      plannedStartDate: ticket.dateStart ? new Date(ticket.dateStart) : undefined,
      plannedEndDate: ticket.dateEnd ? new Date(ticket.dateEnd) : undefined,
    });

    // mark the form as dirty
    this.createTasksFormDialog()?.form.markAsDirty();
  }
}
