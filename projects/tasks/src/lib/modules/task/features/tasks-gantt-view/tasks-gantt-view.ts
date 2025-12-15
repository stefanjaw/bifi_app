import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ganttDependency, ganttTask } from '../../interfaces/task-gantt';
import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs from 'dayjs';
import { viewMode } from '../../interfaces/task-view';
import { task } from '../../interfaces/task';
import { ButtonModule } from 'primeng/button';

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

@Component({
  selector: 'bifi-app-tasks-gantt-view',
  imports: [ButtonModule],
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

  // Outputs
  toggleExpand = output<string>();

  // Signals
  rowHeight = signal(40);
  ganttContainerWidth = signal(0);

  //#region Computed

  // The range of the timeline
  timelineRange = computed(() => {
    const tasks = this.flat();

    // Case: no tasks
    if (tasks.length === 0) {
      const today = dayjs();

      return {
        start: today.startOf('day').subtract(3, 'day').toDate(),
        end: today.endOf('day').add(7, 'day').toDate(),
      };
    }

    // Get start and end dates
    const startDates = tasks.map(t => dayjs(t.plannedStartDate, 'YYYY-MM-DD'));
    const endDates = tasks.map(t => dayjs(t.plannedEndDate, 'YYYY-MM-DD'));

    // Get min and max
    const minDate = dayjs.min(startDates)!;
    const maxDate = dayjs.max(endDates)!;

    return {
      start: minDate.startOf('day').subtract(3, 'day').toDate(),
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

  pixelsPerUnit = computed(() => {
    const width = this.ganttContainerWidth();
    const units = this.gridUnits().length;

    if (!width || !units) return 80;
    return width / units;
  });

  // The width of the timeline
  timelineWidth = computed(() => {
    return this.gridUnits().length * this.pixelsPerUnit();
  });

  // The dates of the grid
  gridUnits = computed(() => {
    const { start, end } = this.timelineRange();
    const view = this.viewMode();
    const units: dayjs.Dayjs[] = [];

    let current = dayjs(start);

    if (view === 'Day') {
      while (current.isSameOrBefore(end, 'day')) {
        units.push(current);
        current = current.add(1, 'day');
      }
    }

    if (view === 'Week') {
      current = current.startOf('week');
      while (current.isSameOrBefore(end, 'day')) {
        units.push(current);
        current = current.add(1, 'week');
      }
    }

    if (view === 'Month') {
      current = current.startOf('month');
      while (current.isSameOrBefore(end, 'day')) {
        units.push(current);
        current = current.add(1, 'month');
      }
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

  // The horizontal offset of today
  todayOffset = computed(() => {
    const today = dayjs().startOf('day');
    const start = dayjs(this.timelineRange().start);

    const daysFromStart = today.diff(start, 'day');

    return daysFromStart * this.pixelsPerDay();
  });

  //#endregion

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
   * Calculates the horizontal offset of a task from the start of the timeline range.
   * The offset is calculated in pixels, and is based on the difference in days between
   * the task's start date and the start of the timeline range.
   * @param task - The task to calculate the offset for.
   * @returns The offset of the task in pixels.
   */
  getTaskOffset(task: ganttTask) {
    const rangeStart = dayjs(this.timelineRange().start);
    return dayjs(task.start).diff(rangeStart, 'day') * this.pixelsPerDay();
  }

  /**
   * Calculates the width of a task in pixels.
   * The width is calculated as the difference in days between the task's start and end dates,
   * plus one day to include the end date, multiplied by the number of pixels per day in the timeline.
   * @param task - The task to calculate the width for.
   * @returns The width of the task in pixels.
   */
  getTaskWidth(task: ganttTask): number {
    const start = dayjs(task.start);
    const end = dayjs(task.end);
    return (end.diff(start, 'day') + 1) * this.pixelsPerDay();
  }

  /**
   * Formats a date header based on the current view mode.
   * When the view mode is 'Day', the header will display the month and day of the month if the date is the first day of the month, otherwise it will only display the day of the month.
   * When the view mode is 'Week', the header will display the range of days in the week, in the format 'MMM D - MMM D'.
   * When the view mode is 'Month', the header will display the month name if the date is the first day of the month, otherwise it will be blank.
   * @param date - The date to format the header for.
   * @returns The formatted date header string.
   */
  formatDateHeader(date: dayjs.Dayjs): string {
    switch (this.viewMode()) {
      case 'Day':
        return date.date() === 1 ? date.format('MMM D') : date.format('D');

      case 'Week': {
        const start = date;
        const end = date.add(6, 'day');

        if (start.month() === end.month()) {
          return `${start.format('MMM D')} - ${end.format('D')}`;
        }

        return `${start.format('MMM D')} - ${end.format('MMM D')}`;
      }

      case 'Month':
        return date.date() === 1 ? date.format('MMM') : '';

      default:
        return '';
    }
  }

  //#endregion
}
