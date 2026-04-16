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
import { CommonModule } from '@angular/common';
import { CalendarDay, CalendarEvent, CalendarViewMode } from '../../interfaces/calendar';
import { CalendarEventCard } from '../calendar-event-card/calendar-event-card';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Component({
  selector: 'bifi-app-calendar-view',
  imports: [CommonModule, CalendarEventCard],
  templateUrl: './calendar-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarView implements OnDestroy {
  events = input<CalendarEvent[]>([]);

  itemClick = output<string>();
  eventDateChange = output<{ id: string; start: Date; end: Date }>();

  view = signal<CalendarViewMode>('month');
  currentDate = signal(new Date());

  monthGrid = signal<CalendarDay[][]>([]);
  weekDays = signal<CalendarDay[]>([]);
  yearMonths = signal<Date[][]>([]);

  isDragging = signal(false);
  dragEventId = signal<string | null>(null);
  dragTypeSignal = signal<'move' | 'resizeStart' | 'resizeEnd' | null>(null);
  dragPreviewStart = signal<Date | null>(null);
  dragPreviewEnd = signal<Date | null>(null);

  readonly DAY_SLOT_PX = 64; // h-16 = 64px per hour row

  sortedEvents = computed(() =>
    this.events()
      .slice()
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  );

  dayEvents = computed(() => {
    const dayStart = dayjs(this.currentDate()).startOf('day');
    const dayEnd = dayStart.add(1, 'day');

    return this.events()
      .filter(e => {
        const evStart = dayjs(e.start);
        const evEnd = dayjs(e.end);

        // Solo eventos que realmente intersectan el día
        return evStart.isBefore(dayEnd) && evEnd.isAfter(dayStart);
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  });

  listEvents = computed(() => {
    const date = this.currentDate();
    return this.sortedEvents().filter(
      e => e.start.getFullYear() === date.getFullYear() && e.start.getMonth() === date.getMonth()
    );
  });

  previewEvent = computed<CalendarEvent | null>(() => {
    const id = this.dragEventId();
    const start = this.dragPreviewStart();
    const end = this.dragPreviewEnd();
    if (!id || !start || !end) return null;
    const event = this.events().find(e => String(e.id) === id);
    if (!event) return null;
    return { ...event, start, end };
  });

  previewMoveLabel = computed(() => {
    const start = this.dragPreviewStart();
    const end = this.dragPreviewEnd();
    if (!start || !end) return '';
    if (this.view() === 'day') {
      const fmt = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${fmt.format(start)} → ${fmt.format(end)}`;
    }
    const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    return `${fmt.format(start)} → ${fmt.format(end)}`;
  });

  previewResizeEndLabel = computed(() => {
    const end = this.dragPreviewEnd();
    if (!end) return '';
    if (this.view() === 'day') {
      return `Until ${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(end)}`;
    }
    return `Until ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(end)}`;
  });

  previewResizeStartLabel = computed(() => {
    const start = this.dragPreviewStart();
    if (!start) return '';
    if (this.view() === 'day') {
      return `From ${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(start)}`;
    }
    return `From ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(start)}`;
  });

  headerTitle = computed(() => {
    const date = this.currentDate();
    switch (this.view()) {
      case 'day':
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
      case 'week': {
        const startOfWeek = dayjs(date).startOf('week');
        const endOfWeek = startOfWeek.add(6, 'day');
        const startMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
          startOfWeek.toDate()
        );
        const endMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
          endOfWeek.toDate()
        );
        if (startMonth === endMonth) {
          return `${startMonth} ${startOfWeek.year()}`;
        }
        return `${startMonth} - ${endMonth} ${endOfWeek.year()}`;
      }
      case 'month':
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
      case 'year':
        return date.getFullYear().toString();
      case 'list':
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
      default:
        return '';
    }
  });

  views: CalendarViewMode[] = ['day', 'week', 'month', 'year', 'list'];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  calendarBody = viewChild<ElementRef<HTMLDivElement>>('calendarBody');
  monthCellGrid = viewChild<ElementRef<HTMLDivElement>>('monthCellGrid');
  dayGrid = viewChild<ElementRef<HTMLDivElement>>('dayGrid');

  private dragType: 'move' | 'resizeStart' | 'resizeEnd' | null = null;
  private dragInitialX = 0;
  private dragInitialY = 0;
  private lastDragX = 0;
  private lastDragY = 0;
  private hasDragged = false;
  private dragInitialStart: Date = new Date();
  private dragInitialEnd: Date = new Date();
  private boundDragMove: ((e: MouseEvent) => void) | null = null;
  private boundDragUp: (() => void) | null = null;

  constructor() {
    this.updateCalendarData();

    effect(() => {
      this.currentDate();
      this.events();
      this.updateCalendarData();
    });
  }

  ngOnDestroy(): void {
    this.removeDragListeners();
  }

  changeView(newView: CalendarViewMode): void {
    this.view.set(newView);
  }

  goToToday(): void {
    this.currentDate.set(new Date());
  }

  previousPeriod(): void {
    this.currentDate.update(d => {
      switch (this.view()) {
        case 'day':
          return dayjs(d).subtract(1, 'day').toDate();
        case 'week':
          return dayjs(d).subtract(7, 'day').toDate();
        case 'month':
        case 'list':
          return dayjs(d).subtract(1, 'month').toDate();
        case 'year':
          return dayjs(d).subtract(1, 'year').toDate();
        default:
          return d;
      }
    });
  }

  nextPeriod(): void {
    this.currentDate.update(d => {
      switch (this.view()) {
        case 'day':
          return dayjs(d).add(1, 'day').toDate();
        case 'week':
          return dayjs(d).add(7, 'day').toDate();
        case 'month':
        case 'list':
          return dayjs(d).add(1, 'month').toDate();
        case 'year':
          return dayjs(d).add(1, 'year').toDate();
        default:
          return d;
      }
    });
  }

  selectMonthInYearView(monthIndex: number): void {
    this.currentDate.update(d => dayjs(d).month(monthIndex).toDate());
    this.view.set('month');
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    return this.events()
      .filter(event => this.eventCoversDay(event, date))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  isToday(date: Date): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
  }

  getMonthName(monthIndex: number): string {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      new Date(2000, monthIndex, 1)
    );
  }

  getFirstDayOfMonth(monthIndex: number): number {
    return new Date(this.currentDate().getFullYear(), monthIndex, 1).getDay();
  }

  isEventBeingDragged(eventId: string | number): boolean {
    return this.isDragging() && this.dragEventId() === String(eventId);
  }

  private getDayBounds(date: Date) {
    const start = dayjs(date).startOf('day');
    const end = start.add(1, 'day');
    return { start, end };
  }

  getDayEventTop(event: CalendarEvent): number {
    const { start: dayStart, end: dayEnd } = this.getDayBounds(this.currentDate());

    const evStart = dayjs(event.start);
    const evEnd = dayjs(event.end);

    // Si no intersecta, no renderizar (defensivo)
    if (evEnd.isSameOrBefore(dayStart) || evStart.isSameOrAfter(dayEnd)) {
      return 0;
    }

    const visibleStart = evStart.isBefore(dayStart) ? dayStart : evStart;

    const minutes = visibleStart.diff(dayStart, 'minute');
    return minutes * (this.DAY_SLOT_PX / 60);
  }

  getDayEventHeight(event: CalendarEvent): number {
    const { start: dayStart, end: dayEnd } = this.getDayBounds(this.currentDate());

    const evStart = dayjs(event.start);
    const evEnd = dayjs(event.end);

    // No intersección → altura 0
    if (evEnd.isSameOrBefore(dayStart) || evStart.isSameOrAfter(dayEnd)) {
      return 0;
    }

    const visibleStart = evStart.isBefore(dayStart) ? dayStart : evStart;
    const visibleEnd = evEnd.isAfter(dayEnd) ? dayEnd : evEnd;

    const duration = visibleEnd.diff(visibleStart, 'minute');

    return Math.max(30, duration * (this.DAY_SLOT_PX / 60));
  }

  getSpanType(event: CalendarEvent, cellDate: Date): 'standalone' | 'start' | 'middle' | 'end' {
    const isActualStart = this.isSameDay(event.start, cellDate);
    const isActualEnd = this.isSameDay(event.end, cellDate);

    if (isActualStart && isActualEnd) return 'standalone';

    if (this.view() === 'month') {
      const isWeekBoundaryStart = cellDate.getDay() === 0;
      const isWeekBoundaryEnd = cellDate.getDay() === 6;
      const isVisualStart = isActualStart || isWeekBoundaryStart;
      const isVisualEnd = isActualEnd || isWeekBoundaryEnd;
      if (isVisualStart && isVisualEnd) return 'standalone';
      if (isVisualStart) return 'start';
      if (isVisualEnd) return 'end';
      return 'middle';
    }

    if (isActualStart) return 'start';
    if (isActualEnd) return 'end';
    return 'middle';
  }

  private dayBoundaryMs(date: Date): { start: number; end: number } {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return { start, end: start + 24 * 60 * 60 * 1000 };
  }

  private eventCoversDay(event: CalendarEvent, date: Date): boolean {
    const d = dayjs(date).startOf('day');
    const s = dayjs(event.start).startOf('day');
    const e = dayjs(event.end).startOf('day');
    return !d.isBefore(s) && !d.isAfter(e);
  }

  onEventMouseDown(
    event: MouseEvent,
    calendarEvent: CalendarEvent,
    type: 'move' | 'resizeStart' | 'resizeEnd'
  ): void {
    event.stopPropagation();
    event.preventDefault();

    this.dragType = type;
    this.dragInitialX = event.clientX;
    this.dragInitialY = event.clientY;
    this.lastDragX = event.clientX;
    this.lastDragY = event.clientY;
    this.hasDragged = false;
    this.dragInitialStart = new Date(calendarEvent.start);
    this.dragInitialEnd = new Date(calendarEvent.end);

    this.dragEventId.set(String(calendarEvent.id));
    this.dragTypeSignal.set(type);
    this.dragPreviewStart.set(new Date(calendarEvent.start));
    this.dragPreviewEnd.set(new Date(calendarEvent.end));
    this.isDragging.set(true);

    this.boundDragMove = (e: MouseEvent) => this.onDragMove(e);
    this.boundDragUp = () => this.onDragUp();
    window.addEventListener('mousemove', this.boundDragMove);
    window.addEventListener('mouseup', this.boundDragUp);
  }

  private onDragMove(event: MouseEvent): void {
    this.lastDragX = event.clientX;
    this.lastDragY = event.clientY;

    const absDeltaX = Math.abs(event.clientX - this.dragInitialX);
    const absDeltaY = Math.abs(event.clientY - this.dragInitialY);
    if (absDeltaX > 5 || absDeltaY > 5) {
      this.hasDragged = true;
    }

    if (this.hasDragged) {
      const { newStart, newEnd } = this.computeNewDates(this.lastDragX, this.lastDragY);
      this.dragPreviewStart.set(newStart);
      this.dragPreviewEnd.set(newEnd);
    }
  }

  private onDragUp(): void {
    if (!this.hasDragged && this.dragType === 'move') {
      this.itemClick.emit(this.dragEventId()!);
    } else if (this.hasDragged) {
      const { newStart, newEnd } = this.computeNewDates(this.lastDragX, this.lastDragY);
      this.eventDateChange.emit({ id: this.dragEventId()!, start: newStart, end: newEnd });
    }

    this.isDragging.set(false);
    this.dragEventId.set(null);
    this.dragTypeSignal.set(null);
    this.dragPreviewStart.set(null);
    this.dragPreviewEnd.set(null);
    this.dragType = null;
    this.hasDragged = false;

    this.removeDragListeners();
  }

  // ── Single flat entry point for all views ────────────────────────────────
  private computeNewDates(mouseX: number, mouseY: number): { newStart: Date; newEnd: Date } {
    let newStart = dayjs(this.dragInitialStart).toDate();
    let newEnd = dayjs(this.dragInitialEnd).toDate();

    // ── MOVE: shift both endpoints by the same delta ──────────────────────
    if (this.dragType === 'move') {
      const deltaMs = this.resolveMoveDeltaMs(mouseX, mouseY);
      newStart = dayjs(this.dragInitialStart).add(deltaMs, 'ms').toDate();
      newEnd = dayjs(this.dragInitialEnd).add(deltaMs, 'ms').toDate();

      // ── RESIZE END ────────────────────────────────────────────────────────
    } else if (this.dragType === 'resizeEnd') {
      if (this.view() === 'day') {
        const min = this.resolveTargetMinutes(mouseY);
        if (min >= 0) {
          const sameDay = this.isSameDay(this.dragInitialStart, this.dragInitialEnd);
          const initStartMin =
            dayjs(this.dragInitialStart).hour() * 60 + dayjs(this.dragInitialStart).minute();
          const floor = sameDay ? initStartMin + 15 : 0;
          const clamped = Math.max(floor, Math.min(1439, min));
          newEnd = dayjs(newEnd)
            .hour(Math.floor(clamped / 60))
            .minute(clamped % 60)
            .second(0)
            .millisecond(0)
            .toDate();
        }
      } else {
        const target = this.resolveTargetDate(mouseX, mouseY);
        if (target) {
          newEnd = dayjs(newEnd)
            .year(target.getFullYear())
            .month(target.getMonth())
            .date(target.getDate())
            .toDate();
          if (newEnd < newStart) newEnd = new Date(newStart.getTime());
        }
      }

      // ── RESIZE START ──────────────────────────────────────────────────────
    } else if (this.dragType === 'resizeStart') {
      if (this.view() === 'day') {
        const min = this.resolveTargetMinutes(mouseY);
        if (min >= 0) {
          const sameDay = this.isSameDay(this.dragInitialStart, this.dragInitialEnd);
          const initEndMin =
            dayjs(this.dragInitialEnd).hour() * 60 + dayjs(this.dragInitialEnd).minute();
          const ceil = sameDay ? initEndMin - 15 : 1439;
          const clamped = Math.min(ceil, Math.max(0, min));
          newStart = dayjs(newStart)
            .hour(Math.floor(clamped / 60))
            .minute(clamped % 60)
            .second(0)
            .millisecond(0)
            .toDate();
        }
      } else {
        const target = this.resolveTargetDate(mouseX, mouseY);
        if (target) {
          newStart = dayjs(newStart)
            .year(target.getFullYear())
            .month(target.getMonth())
            .date(target.getDate())
            .toDate();
          if (newStart > newEnd) newStart = new Date(newEnd.getTime());
        }
      }
    }

    return { newStart, newEnd };
  }

  // Returns ms to add to both start and end for a move operation.
  // Day view: Y-axis pixel delta → minute delta → ms.
  // Week/month: X/Y pixel delta → day delta → ms.
  private resolveMoveDeltaMs(mouseX: number, mouseY: number): number {
    if (this.view() === 'day') {
      const deltaY = mouseY - this.dragInitialY;
      const deltaMin = Math.round(deltaY / (this.DAY_SLOT_PX / 60) / 15) * 15;
      return deltaMin * 60_000;
    }

    const container = this.calendarBody();
    if (!container) return 0;

    const deltaX = mouseX - this.dragInitialX;
    const deltaY = mouseY - this.dragInitialY;
    const columnDelta = Math.round(deltaX / (container.nativeElement.clientWidth / 7));

    let rowDelta = 0;
    if (this.view() === 'month') {
      const grid = this.monthCellGrid();
      if (grid) {
        const numWeeks = this.monthGrid().length;
        if (numWeeks > 0) {
          rowDelta = Math.round(deltaY / (grid.nativeElement.clientHeight / numWeeks));
        }
      }
    }

    return (columnDelta + rowDelta * 7) * 86_400_000;
  }

  // Returns the calendar date under the mouse for week/month resize operations.
  private resolveTargetDate(mouseX: number, mouseY: number): Date | null {
    const container = this.calendarBody();
    if (!container) return null;

    const rect = container.nativeElement.getBoundingClientRect();
    const colIndex = Math.max(0, Math.min(6, Math.floor((mouseX - rect.left) / (rect.width / 7))));

    if (this.view() === 'week') {
      const days = this.weekDays();
      return days[colIndex] ? new Date(days[colIndex].date) : null;
    }

    if (this.view() === 'month') {
      const grid = this.monthCellGrid();
      if (!grid) return null;
      const gridRect = grid.nativeElement.getBoundingClientRect();
      const weeks = this.monthGrid();
      const numWeeks = weeks.length;
      if (numWeeks === 0) return null;
      const rowIndex = Math.max(
        0,
        Math.min(numWeeks - 1, Math.floor((mouseY - gridRect.top) / (gridRect.height / numWeeks)))
      );
      return weeks[rowIndex]?.[colIndex] ? new Date(weeks[rowIndex][colIndex].date) : null;
    }

    return null;
  }

  // Returns minute-of-day [0–1439] under the mouse for day-view resize.
  // Uses the inner grid element so getBoundingClientRect already accounts for scroll.
  // Returns -1 when the grid element is not yet in the DOM.
  private resolveTargetMinutes(mouseY: number): number {
    const grid = this.dayGrid();
    if (!grid) return -1;
    const rect = grid.nativeElement.getBoundingClientRect();
    const relativeY = mouseY - rect.top;
    const rawMinutes = relativeY / (this.DAY_SLOT_PX / 60);
    return Math.max(0, Math.min(1439, Math.round(rawMinutes / 15) * 15));
  }

  private removeDragListeners(): void {
    if (this.boundDragMove) window.removeEventListener('mousemove', this.boundDragMove);
    if (this.boundDragUp) window.removeEventListener('mouseup', this.boundDragUp);
    this.boundDragMove = null;
    this.boundDragUp = null;
  }

  private updateCalendarData(): void {
    const date = this.currentDate();
    const events = this.events();

    const monthGridData = this.getMonthGrid(date);
    monthGridData.forEach(week =>
      week.forEach(day => {
        day.events = events
          .filter(e => this.eventCoversDay(e, day.date))
          .sort((a, b) => a.start.getTime() - b.start.getTime());
      })
    );
    this.monthGrid.set(monthGridData);

    const weekDaysData = this.getWeekDays(date);
    weekDaysData.forEach(day => {
      day.events = events
        .filter(e => this.eventCoversDay(e, day.date))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    this.weekDays.set(weekDaysData);

    this.yearMonths.set(this.getYearMonths(date.getFullYear()));
  }

  private getMonthGrid(date: Date): CalendarDay[][] {
    const month = dayjs(date).month();
    const start = dayjs(date).startOf('month').startOf('week'); // Sunday before month start
    const end = dayjs(date).endOf('month').endOf('week'); // Saturday after month end

    const grid: CalendarDay[][] = [];
    let week: CalendarDay[] = [];
    let cur = start;

    while (!cur.isAfter(end, 'day')) {
      week.push({
        date: cur.toDate(),
        isCurrentMonth: cur.month() === month,
        isToday: cur.isSame(dayjs(), 'day'),
        events: [],
      });
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
      cur = cur.add(1, 'day');
    }
    return grid;
  }

  private getWeekDays(date: Date): CalendarDay[] {
    const startOfWeek = dayjs(date).startOf('week'); // Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = startOfWeek.add(i, 'day');
      return {
        date: day.toDate(),
        isCurrentMonth: true,
        isToday: day.isSame(dayjs(), 'day'),
        events: [],
      };
    });
  }

  private getYearMonths(year: number): Date[][] {
    return Array.from({ length: 12 }, (_, month) => {
      const start = dayjs(new Date(year, month, 1));
      const end = start.endOf('month');
      const days: Date[] = [];
      let cur = start;
      while (!cur.isAfter(end, 'day')) {
        days.push(cur.toDate());
        cur = cur.add(1, 'day');
      }
      return days;
    });
  }
}
