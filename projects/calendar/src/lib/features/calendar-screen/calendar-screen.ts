import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CalendarEvent, CalendarView } from '@avalantec/base-app/resource';
import { CrudTasks } from '@avalantec/tasks';
import { CrudTickets } from '@avalantec/helpdesk';
import { CrudProjects } from '@avalantec/projects';
import dayjs from 'dayjs';

@Component({
  selector: 'bifi-app-calendar-screen',
  imports: [CalendarView],
  templateUrl: './calendar-screen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarScreen {
  private crudTasks = inject(CrudTasks);
  private crudTickets = inject(CrudTickets);
  private crudProjects = inject(CrudProjects);

  private tasksResource = this.crudTasks.get({});
  private ticketsResource = this.crudTickets.get({});
  private projectsResource = this.crudProjects.get({});

  calendarEvents = computed<CalendarEvent[]>(() => {
    const tasks = this.tasksResource.value() ?? [];
    const tickets = this.ticketsResource.value() ?? [];
    const projects = this.projectsResource.value() ?? [];

    const today = new Date();
    const events: CalendarEvent[] = [];

    tasks.forEach(task => {
      const start = task.plannedStartDate ? dayjs(task.plannedStartDate).toDate() : today;
      const end = task.plannedEndDate
        ? dayjs(task.plannedEndDate).toDate()
        : new Date(start.getTime() + 3600000);
      events.push({
        id: task._id,
        title: `(Task) ${task.name}`,
        start,
        end,
        color: 'blue',
      });
    });

    tickets.forEach(ticket => {
      const start = ticket.dateStart ? dayjs(ticket.dateStart).toDate() : today;
      const end = ticket.dateEnd
        ? dayjs(ticket.dateEnd).toDate()
        : new Date(start.getTime() + 3600000);
      events.push({
        id: ticket._id,
        title: `(Ticket) ${ticket.name}`,
        start,
        end,
        color: 'pink',
      });
    });

    projects.forEach(project => {
      const start = project.dateStart ? dayjs(project.dateStart).toDate() : today;
      const end = project.dateEnd
        ? dayjs(project.dateEnd).toDate()
        : new Date(start.getTime() + 3600000);
      events.push({
        id: project._id,
        title: `(Project) ${project.name}`,
        start,
        end,
        color: 'green',
      });
    });

    return events;
  });
}
