import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  signal,
  untracked,
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
import { CrudTasks, CrudTaskTypes } from '@avalantec/tasks';
import { switchMap } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

const TASKS_VIEW_QUERY_KEY = '_view';

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
    TooltipModule
  ],
  templateUrl: './ticket-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketList {
  private resourceManager = inject<ResourceManager<ticket>>(ResourceManager);
  private crudTickets = inject(CrudTickets);
  private crudTasks = inject(CrudTasks);
  private crudTaskTypes = inject(CrudTaskTypes);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);

  // states
  viewState = signal<'list' | 'calendar'>('list');
  private _viewRestored = signal(false);
  isListView = computed(() => this.viewState() === 'list');

  // resources
  taskTypeResource = this.crudTaskTypes.get({});

  columns = ticketColumns;
  filters = ticketFilters;
  filterFields = ticketFilterFields;

  // data
  taskTypes = this.taskTypeResource.value;
  tickets = this.resourceManager.data;
  isLoading = this.resourceManager.data.isLoading;
  error = this.resourceManager.data.error;

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

    // After the first render, allow the _view URL sync effect to write.
    afterNextRender(() => {
      this._viewRestored.set(true);
    });

    effect(() => {
      if (!this._viewRestored()) return;
      const view = this.viewState();
      untracked(() => {
        const win = this.document?.defaultView;
        if (!win) return;
        const existing = new URLSearchParams(win.location.search);
        existing.set(TASKS_VIEW_QUERY_KEY, view);
        win.history.replaceState(
          win.history.state,
          '',
          win.location.pathname + '?' + existing.toString()
        );
      });
    });
  }

  private _restoreViewState(): void {
    const params = this.route.snapshot.queryParams as Record<string, string>;
    const view = params[TASKS_VIEW_QUERY_KEY] as 'list' | 'calendar';
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
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  createTask(ticket: ticket) {
    // Get the first task type (you might want to make this more sophisticated in a real app)
    const taskType = this.taskTypes()?.[0];

    // Create the task
    const createTask = this.crudTasks.post({
      data: {
        name: ticket.name,
        description: ticket.description,
        typeId: taskType?._id,
        plannedStartDate: ticket.dateStart,
        plannedEndDate: ticket.dateEnd,
      },
    });

    // update ticket with the created task id
    const ticketUpdate = (taskId: string) =>
      this.crudTickets.put({
        _id: ticket._id,
        data: {
          taskIds: [...(ticket.taskIds?.map(t => t._id) ?? []), taskId],
        },
      });

    // Update the ticket
    createTask
      .pipe(
        takeUntilDestroyed(this.destroy$),
        switchMap(res => ticketUpdate(res?._id ?? ''))
      )
      .subscribe({});
  }
}
