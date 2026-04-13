import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
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
import { TooltipModule } from 'primeng/tooltip';

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

export interface DayTick {
  pos: number;
  type: 'main' | 'hour' | 'half';
  label: string;
  /** CSS transform applied to the label span.
   *  h=0  → 'translateX(0)'    (left-aligned, no left-edge clipping)
   *  h=24 → 'translateX(-100%)' (right-aligned, no right-edge clipping)
   *  else → 'translateX(-50%)' (centered on tick)
   */
  labelTransform: string;
}

@Component({
  selector: 'bifi-app-tasks-gantt-view',
  imports: [ButtonModule, CommonModule, TaskGanttCard, TooltipModule],
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

  /** Accumulated pan offset in days (float during drag, snapped to int on mouseup for Day/Week). */
  panOffsetDays = signal(0);

  /** True while the user is dragging the canvas. Used for cursor class binding. */
  isDragging = signal(false);

  // services
  crudTasks = inject(CrudTasks);
  private destroy$ = inject(DestroyRef);
  private ngZone = inject(NgZone);
  protected taskMaintenanceContext = inject(TasksMaintenanceContext);

  // Drag-to-pan state (plain fields — not signals, never drive the template)
  private dragStartX = 0;
  private dragBaseOffset = 0;
  private boundMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundMouseUp: (() => void) | null = null;

  //#region Computed

  // The range of the timeline.
  // Day  → the panned day (00:00 – 23:59)
  // Week → the panned week (Mon–Sun or locale week)
  // Month / Year → full task date span + 7-day buffer (scroll-based pan, range unchanged)
  timelineRange = computed(() => {
    const mode = this.viewMode();
    const pan = this.panOffsetDays();
    const today = dayjs();

    if (mode === 'Day') {
      // Pan unit = hours. anchor = midnight + pan hours.
      // pan=0 → 00:00 today; pan=1 → 01:00 today; pan=24 → 00:00 tomorrow.
      const anchor = today.startOf('day').add(pan, 'hour');
      return { start: anchor.toDate(), end: anchor.add(1, 'day').toDate() };
    }

    if (mode === 'Week') {
      // Pan unit = days from Monday of the current ISO week.
      // pan=0 → Mon of current week; pan=7 → Mon of next week.
      // Monday offset: (day()+6)%7 days back (0=Sun→6, 1=Mon→0, 6=Sat→5).
      const monday = today.startOf('day').subtract((today.day() + 6) % 7, 'day');
      const anchor = monday.add(pan, 'day');
      return { start: anchor.toDate(), end: anchor.add(7, 'day').toDate() };
    }

    if (mode === 'Month') {
      // Pan unit = days from the 1st of the current month.
      // pan=0 → day 1 of current month; pan=1 → day 2; pan=30 → day 1 of next month.
      const anchor = today.startOf('month').add(pan, 'day');
      return { start: anchor.toDate(), end: anchor.add(29, 'day').endOf('day').toDate() };
    }

    // Year: pan unit = months from 1 Jan of the current year.
    // pan=0 → Jan; pan=1 → Feb; pan=12 → Jan next year.
    const anchor = today.startOf('year').add(pan, 'month');
    return { start: anchor.toDate(), end: anchor.add(11, 'month').endOf('month').toDate() };
  });

  // Total number of atomic units shown in the timeline
  // Day   → 24 (hours)
  // Week  → 7 (days)
  // Month → 30 (fixed day columns 1–30)
  // Year  → 12 (fixed month columns Jan–Dec)
  totalUnits = computed(() => {
    const mode = this.viewMode();
    if (mode === 'Day') return 24;
    if (mode === 'Week') return 7;
    if (mode === 'Month') return 30;
    return 12; // Year
  });

  // Pixels per atomic unit
  pixelsPerUnit = computed(() => {
    const containerWidth = this.ganttContainerWidth();
    return containerWidth / this.totalUnits();
  });

  // Total pixel width of the timeline
  timelineWidth = computed(() => {
    return this.gridUnits().length * this.pixelsPerUnit();
  });

  // The grid units (one entry per visible column).
  // Day   → 24 hourly dayjs objects starting from the panned anchor day
  // Week  → 7 daily dayjs objects from the panned anchor week start
  // Month → 30 daily dayjs objects from day 1 of the panned month
  // Year  → 12 monthly dayjs objects (Jan–Dec) of the panned year
  gridUnits = computed(() => {
    const mode = this.viewMode();
    const pan = this.panOffsetDays();

    if (mode === 'Day') {
      // Pan unit = hours. Mirror timelineRange anchor exactly.
      const anchor = dayjs().startOf('day').add(pan, 'hour');
      return Array.from({ length: 24 }, (_, i) => anchor.add(i, 'hour'));
    }

    if (mode === 'Week') {
      // Pan unit = days from Monday of current ISO week.
      const now = dayjs();
      const monday = now.startOf('day').subtract((now.day() + 6) % 7, 'day');
      const anchor = monday.add(pan, 'day');
      return Array.from({ length: 7 }, (_, i) => anchor.add(i, 'day'));
    }

    if (mode === 'Month') {
      // Pan unit = days from 1st of current month.
      const anchor = dayjs().startOf('month').add(pan, 'day');
      return Array.from({ length: 30 }, (_, i) => anchor.add(i, 'day'));
    }

    // Year: pan unit = months from 1 Jan of current year.
    const anchor = dayjs().startOf('year').add(pan, 'month');
    return Array.from({ length: 12 }, (_, i) => anchor.add(i, 'month'));
  });

  /**
   * Tick marks for the Day-mode ruler header.
   * Covers hours 0–24 (main ticks every 3h, hour ticks otherwise)
   * plus half-hour subticks at every N.5h.
   * Each tick carries:
   *   pos   — left-edge position in px
   *   type  — 'main' | 'hour' | 'half'
   *   label — non-empty string only for main ticks (e.g. "0", "3", "24")
   */
  dayViewTicks = computed((): DayTick[] => {
    if (this.viewMode() !== 'Day') return [];
    const ppu = this.pixelsPerUnit();
    const pan = this.panOffsetDays();
    // anchorHour: the wall-clock hour at the left edge of the 24-hour window.
    // Pan is now in whole hours (snapped on mouseup) so labels are always exact.
    // Use the same midnight-based anchor as timelineRange / gridUnits.
    const anchorHour = dayjs().startOf('day').add(pan, 'hour').hour();
    const ticks: DayTick[] = [];

    for (let h = 0; h <= 24; h++) {
      const clockHour = (anchorHour + h) % 24;
      const isMain = clockHour % 3 === 0;
      const labelTransform =
        h === 0 ? 'translateX(0)' : h === 24 ? 'translateX(-100%)' : 'translateX(-50%)';
      ticks.push({
        pos: h * ppu,
        type: isMain ? 'main' : 'hour',
        label: isMain ? String(clockHour) : '',
        labelTransform,
      });
      if (h < 24) {
        ticks.push({
          pos: (h + 0.5) * ppu,
          type: 'half',
          label: '',
          labelTransform: 'translateX(-50%)',
        });
      }
    }

    return ticks;
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

  // Offset in pixels for the "today" / "NOW" marker, accounting for panning.
  // Returns -1 when the current moment is outside the panned view (chip + line are hidden).
  // Day mode: fractional-hour position; hidden if panned day ≠ today.
  // Week mode: centre of today's column; hidden if today is outside the displayed 7-day window.
  // Month/Year: centre of today's day column within the date span.
  todayOffset = computed(() => {
    const ppu = this.pixelsPerUnit();
    const mode = this.viewMode();
    const pan = this.panOffsetDays();

    if (mode === 'Day') {
      const now = dayjs();
      // Pan unit = hours. Anchor = midnight + pan hours.
      const anchor = dayjs().startOf('day').add(pan, 'hour');
      const diffHours = now.diff(anchor, 'hour', true);
      if (diffHours < 0 || diffHours >= 24) return -1;
      return diffHours * ppu;
    }

    if (mode === 'Week') {
      const today = dayjs().startOf('day');
      // Pan unit = days from Monday of current ISO week.
      const monday = today.subtract((today.day() + 6) % 7, 'day');
      const anchor = monday.add(pan, 'day');
      const daysSinceStart = today.diff(anchor, 'day');
      if (daysSinceStart < 0 || daysSinceStart >= 7) return -1;
      return daysSinceStart * ppu + ppu / 2;
    }

    if (mode === 'Month') {
      const today = dayjs().startOf('day');
      // Pan unit = days from 1st of current month.
      const anchor = dayjs().startOf('month').add(pan, 'day');
      const daysSinceStart = today.diff(anchor, 'day');
      if (daysSinceStart < 0 || daysSinceStart >= 30) return -1;
      return daysSinceStart * ppu + ppu / 2;
    }

    // Year: pan unit = months from 1 Jan of current year.
    const today = dayjs();
    const anchor = dayjs().startOf('year').add(pan, 'month');
    const monthsSinceStart = today.diff(anchor, 'month');
    if (monthsSinceStart < 0 || monthsSinceStart >= 12) return -1;
    return monthsSinceStart * ppu + ppu / 2;
  });

  //#endregion

  /**
   * Constructor for the TasksGanttViewComponent.
   * Sets up a ResizeObserver to detect changes to the width of the gantt container element.
   * Resets panOffsetDays when the viewMode changes.
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

    // Reset pan when switching view modes so stale offsets don't carry over.
    effect(() => {
      this.viewMode();
      this.panOffsetDays.set(0);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.removeDragListeners();
  }

  //#region Drag-to-pan

  /**
   * Mousedown on the gantt canvas. Ignores clicks on task bar elements so they
   * retain their own drag-to-resize behaviour.
   * Direction: drag left → canvas moves left → later time. (Google Maps convention.)
   *
   * Listeners are registered via runOutsideAngular so every raw mousemove does not
   * trigger Angular's change detection. Signal writes are wrapped in ngZone.run so
   * OnPush components still re-render when values change.
   */
  onGanttMouseDown(event: MouseEvent): void {
    if ((event.target as Element).closest('bifi-app-task-gantt-bar')) return;

    event.preventDefault();

    this.viewMode();
    this.dragStartX = event.clientX;
    this.dragBaseOffset = this.panOffsetDays();

    this.ngZone.run(() => this.isDragging.set(true));

    this.ngZone.runOutsideAngular(() => {
      this.boundMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - this.dragStartX;
        const ppu = this.pixelsPerUnit();

        // Negative deltaX (drag left) → positive offset → later time/date. ✓
        //
        // All modes: 1 column drag (ppu px) = 1 pan-unit advance.
        //   Day   → pan unit = hours  → 1 column = 1 hour
        //   Week  → pan unit = days   → 1 column = 1 day
        //   Month → pan unit = days   → 1 column = 1 day  (30-day sliding window)
        //   Year  → pan unit = months → 1 column = 1 month (12-month sliding window)
        const delta = -deltaX / ppu;

        this.ngZone.run(() => this.panOffsetDays.set(this.dragBaseOffset + delta));
      };

      this.boundMouseUp = () => {
        this.ngZone.run(() => {
          this.isDragging.set(false);
          // Snap to nearest integer pan unit for all modes.
          this.panOffsetDays.set(Math.round(this.panOffsetDays()));
        });
        this.removeDragListeners();
      };

      document.addEventListener('mousemove', this.boundMouseMove!);
      document.addEventListener('mouseup', this.boundMouseUp!);
    });
  }

  private removeDragListeners(): void {
    if (this.boundMouseMove) document.removeEventListener('mousemove', this.boundMouseMove);
    if (this.boundMouseUp) document.removeEventListener('mouseup', this.boundMouseUp);
    this.boundMouseMove = null;
    this.boundMouseUp = null;
  }

  //#endregion

  //#region Methods

  /**
   * Calculates the offset of a task in pixels relative to the start of the timeline.
   * Day mode: offset by hours; other modes: offset by days.
   */
  getTaskOffset(task: ganttTask) {
    const ppu = this.pixelsPerUnit();
    const mode = this.viewMode();

    if (mode === 'Day') {
      const rangeStart = dayjs(this.timelineRange().start);
      return dayjs(task.start).diff(rangeStart, 'hour') * ppu;
    }

    if (mode === 'Year') {
      // Each column = 1 month. Offset by whole months from Jan of the displayed year.
      const rangeStart = dayjs(this.timelineRange().start);
      return dayjs(task.start).diff(rangeStart, 'month') * ppu;
    }

    // Day, Week, Month: day-granularity offset.
    const rangeStart = dayjs(this.timelineRange().start);
    return dayjs(task.start).diff(rangeStart, 'day') * ppu;
  }

  /**
   * Calculates the width of a task in pixels.
   * Day: hours. Year: months. Week/Month: days.
   */
  getTaskWidth(task: ganttTask) {
    const ppu = this.pixelsPerUnit();
    const mode = this.viewMode();

    if (mode === 'Day') {
      const start = dayjs(task.start);
      const end = dayjs(task.end);
      return Math.max(end.diff(start, 'hour'), 1) * ppu;
    }

    if (mode === 'Year') {
      const start = dayjs(task.start);
      const end = dayjs(task.end);
      return Math.max(end.diff(start, 'month') + 1, 1) * ppu;
    }

    // Week + Month: day-granularity width.
    const start = dayjs(task.start);
    const end = dayjs(task.end);
    return (end.diff(start, 'day') + 1) * ppu;
  }

  /**
   * Returns the header label for a grid unit (used by Week / Month / Year modes).
   * Day mode uses the dayViewTicks ruler instead of this function.
   */
  formatDateHeader(date: dayjs.Dayjs): string {
    switch (this.viewMode()) {
      case 'Week':
        return date.format('ddd MMM D');
      case 'Month':
        // Each column is one day; label = day number (1–30).
        return String(date.date());
      case 'Year':
        // Each column is one month; label = 3-letter month name.
        return date.format('MMM');
      default:
        return '';
    }
  }

  /** Whether every column should display a left border (not just labelled ones). */
  showColumnBorder(): boolean {
    const mode = this.viewMode();
    return mode === 'Day' || mode === 'Week';
  }

  /**
   * Pans the Gantt chart so that the given task's bar is horizontally centered
   * in the visible timeline window. Works in all four view modes.
   *
   * The strategy: compute the task's temporal midpoint in the mode's own
   * pan-unit (hours for Day, days for Week/Month, months for Year), then
   * subtract half the window width (12h / 3.5d / 15d / 6mo) and snap to the
   * nearest integer — matching the drag-to-pan snapping behaviour.
   */
  scrollToTask(task: ganttTask): void {
    if (!task.start || !task.end) return;

    const start = dayjs(task.start);
    const end = dayjs(task.end);
    const mode = this.viewMode();

    let newPan: number;

    if (mode === 'Day') {
      // Pan unit = hours from midnight of today.
      const midnight = dayjs().startOf('day');
      const midHours =
        (start.diff(midnight, 'hour', true) + end.diff(midnight, 'hour', true)) / 2;
      newPan = midHours - 12;
    } else if (mode === 'Week') {
      // Pan unit = days from Monday of the current ISO week.
      const now = dayjs();
      const monday = now.startOf('day').subtract((now.day() + 6) % 7, 'day');
      const midDays =
        (start.diff(monday, 'day', true) + end.diff(monday, 'day', true)) / 2;
      newPan = midDays - 3.5;
    } else if (mode === 'Month') {
      // Pan unit = days from the 1st of the current month.
      const monthStart = dayjs().startOf('month');
      const midDays =
        (start.diff(monthStart, 'day', true) + end.diff(monthStart, 'day', true)) / 2;
      newPan = midDays - 15;
    } else {
      // Year: pan unit = months from 1 Jan of the current year.
      const yearStart = dayjs().startOf('year');
      const midMonths =
        (start.diff(yearStart, 'month', true) + end.diff(yearStart, 'month', true)) / 2;
      newPan = midMonths - 6;
    }

    this.panOffsetDays.set(Math.round(newPan));
  }

  /**
   * Updates the planned start and end dates of a task with the given ID.
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
