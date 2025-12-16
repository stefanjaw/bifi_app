import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { ganttDependency, ganttTask } from '../../interfaces/task-gantt';
import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { viewMode } from '../../interfaces/task-view';
import { task } from '../../interfaces/task';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TaskGanttCard } from '../task-gantt-bar/task-gantt-bar';
import { CrudTasks } from '../../services/crud-tasks';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksMaintenanceContext } from '../../services/tasks-maintenance-context';

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

@Component({
  selector: 'bifi-app-tasks-gantt-view',
  imports: [ButtonModule, CommonModule, TaskGanttCard],
  templateUrl: './tasks-gantt-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksGanttView implements OnDestroy {
  // Inputs
  flat = input<task[]>([]);
  map = input<Map<string, ganttTask>>(new Map());
  tree = input<ganttTask[]>([]);
  visible = input<ganttTask[]>([]);
  viewMode = input<viewMode>('Day');
  dependencies = input<ganttDependency[]>([]);

  // inject service to get full screen
  ganttContainer = viewChild<ElementRef<HTMLDivElement>>('ganttContainer');
  resizeObserver?: ResizeObserver;

  // Signals
  rowHeight = signal(40);
  ganttContainerWidth = signal(0);

  // services
  crudTasks = inject(CrudTasks);
  private destroy$ = inject(DestroyRef);
  protected taskMaintenanceContext = inject(TasksMaintenanceContext);

  //#region Computed

  // The range of the timeline
  timelineRange = computed(() => {
    const tasks = this.flat();

    if (!tasks.length) {
      const today = dayjs();
      return { start: today.startOf('day').toDate(), end: today.endOf('day').toDate() };
    }

    const startDates = tasks.map(t => dayjs(t.plannedStartDate));
    const endDates = tasks.map(t => dayjs(t.plannedEndDate));

    const minDate = dayjs.min(startDates)!;
    const maxDate = dayjs.max(endDates)!;

    // Para semana/mes, limitar exactamente a las fechas
    return {
      start: minDate.startOf('day').subtract(7, 'day').toDate(),
      end: maxDate.endOf('day').add(7, 'day').toDate(),
    };
  });

  // The number of days in the timeline
  totalDays = computed(() => {
    const { start, end } = this.timelineRange();
    return dayjs(end).diff(dayjs(start), 'day') + 1;
  });

  // The number of pixels per units
  pixelsPerDay = computed(() => {
    const containerWidth = this.ganttContainerWidth();
    const totalDays = this.totalDays();
    return containerWidth / totalDays;
  });

  // The width of the timeline
  timelineWidth = computed(() => {
    return this.gridUnits().length * this.pixelsPerDay();
  });

  // The dates of the grid
  gridUnits = computed(() => {
    const { start, end } = this.timelineRange();
    const units: dayjs.Dayjs[] = [];

    let current = dayjs(start);

    while (current.isSameOrBefore(end, 'day')) {
      units.push(current);
      current = current.add(1, 'day');
    }

    return units;
  });

  // The paths of the dependencies
  dependencyPaths = computed(() => {
    const visible = this.visible();
    const map = this.map();
    const deps = this.dependencies();
    const rowHeight = this.rowHeight();

    if (!visible.length || !map.size || !deps.length) {
      return [];
    }

    const indexMap = new Map<string, number>();
    visible.forEach((task, i) => indexMap.set(task.id, i));

    const paths: string[] = [];

    for (const dep of deps) {
      const from = map.get(dep.from);
      const to = map.get(dep.to);
      const fromIndex = indexMap.get(dep.from);
      const toIndex = indexMap.get(dep.to);

      if (!from || !to || fromIndex == null || toIndex == null) continue;

      const startX = this.getTaskOffset(from) + this.getTaskWidth(from);
      const startY = fromIndex * rowHeight + rowHeight / 2;

      const endX = this.getTaskOffset(to) - 8;
      const endY = toIndex * rowHeight + rowHeight / 2;

      const r = 15;

      if (endX > startX) {
        paths.push(`M ${startX},${startY} H ${startX + r / 2} V ${endY} H ${endX}`);
      } else {
        const midY = startY < endY ? startY + rowHeight / 2 : startY - rowHeight / 2;

        paths.push(
          `M ${startX},${startY}
             H ${startX + r}
             V ${midY}
             H ${endX - r}
             V ${endY}
             H ${endX}`
        );
      }
    }

    return paths;
  });

  todayOffset = computed(() => {
    const today = dayjs().startOf('day');
    const start = dayjs(this.timelineRange().start);
    const daysFromStart = today.diff(start, 'day');
    return daysFromStart * this.pixelsPerDay() + this.pixelsPerDay() / 2;
  });

  //#endregion

  /**
   * Constructor for the TasksGanttViewComponent.
   * Sets up a ResizeObserver to detect changes to the width of the gantt container element.
   * When the width changes, the component's width is updated.
   */
  constructor() {
    effect(() => {
      const ganttContainer = this.ganttContainer();

      if (!ganttContainer) return;

      this.resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        this.ganttContainerWidth.set(entry.contentRect.width);
      });

      this.resizeObserver.observe(ganttContainer.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  //#region Methods

  /**
   * Calculates the offset of a task in pixels, relative to the start of the timeline range.
   * The offset is calculated by multiplying the difference in days between the task's start date and the start of the timeline range by the number of pixels per day.
   * @param task - The task to calculate the offset for.
   * @returns The offset of the task in pixels.
   */
  getTaskOffset(task: ganttTask) {
    const rangeStart = dayjs(this.timelineRange().start);
    return dayjs(task.start).diff(rangeStart, 'day') * this.pixelsPerDay();
  }

  /**
   * Calculates the width of a task in pixels, based on the difference in days between its start and end dates.
   * The width is calculated by multiplying the difference in days by the number of pixels per day.
   * @param task - The task to calculate the width for.
   * @returns The width of the task in pixels.
   */
  getTaskWidth(task: ganttTask) {
    const start = dayjs(task.start);
    const end = dayjs(task.end);
    return (end.diff(start, 'day') + 1) * this.pixelsPerDay();
  }

  /**
   * Returns a formatted string representing the given date, depending on the current view mode.
   * If the view mode is 'Day', the string will be in the format 'MMM D' if the date is the first of the month, and 'D' otherwise.
   * If the view mode is 'Week', the string will be in the format 'MMM D' - 'D' if the date is the start of the week and the end of the week is in the same month, and 'MMM D' - 'MMM D' otherwise.
   * If the view mode is 'Month', the string will be in the format 'MMM' if the date is the first of the month, and an empty string otherwise.
   * @param date - The date to format.
   * @param index - The index of the date in the array of dates.
   * @returns A formatted string representing the given date.
   */
  formatDateHeader(date: dayjs.Dayjs, index: number): string {
    switch (this.viewMode()) {
      case 'Day':
        return date.date() === 1 || index === 0 ? date.format('MMM D') : date.format('D');
      case 'Week': {
        const start = date;
        const end = date.endOf('week');

        if (!start.isSame(start.startOf('week'), 'day') && index !== 0) return '';

        return start.month() === end.month()
          ? `${start.format('MMM D')} - ${end.format('D')}`
          : `${start.format('MMM D')} - ${end.format('MMM D')}`;
      }
      case 'Month':
        return date.date() === 1 || index === 0 ? date.format('MMM') : '';
      default:
        return '';
    }
  }

  /**
   * Updates the planned start and end dates of a task with the given ID.
   * The task will be updated in the database and the taskCreatedOrUpdated event will be emitted.
   * @param taskId - The ID of the task to update.
   * @param start - The new planned start date of the task.
   * @param end - The new planned end date of the task.
   */
  updateTaskDates(taskId: string, start: dayjs.Dayjs, end: dayjs.Dayjs) {
    this.crudTasks
      .put({
        _id: taskId,
        data: {
          plannedStartDate: start.toISOString(),
          plannedEndDate: end.toISOString(),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: task => {
          if (task) this.taskMaintenanceContext.taskCreatedOrUpdated();
        },
      });
  }

  //#endregion
}
