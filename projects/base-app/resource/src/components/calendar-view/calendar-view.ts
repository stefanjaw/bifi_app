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

  sortedEvents = computed(() =>
    this.events()
      .slice()
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  );

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
    const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    return `${fmt.format(start)} → ${fmt.format(end)}`;
  });

  previewResizeEndLabel = computed(() => {
    const end = this.dragPreviewEnd();
    if (!end) return '';
    return `Until ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(end)}`;
  });

  previewResizeStartLabel = computed(() => {
    const start = this.dragPreviewStart();
    if (!start) return '';
    return `From ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(start)}`;
  });

  headerTitle = computed(() => {
    const date = this.currentDate();
    switch (this.view()) {
      case 'day':
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
      case 'week': {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const startMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(startOfWeek);
        const endMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(endOfWeek);
        if (startMonth === endMonth) {
          return `${startMonth} ${startOfWeek.getFullYear()}`;
        }
        return `${startMonth} - ${endMonth} ${endOfWeek.getFullYear()}`;
      }
      case 'month':
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
      case 'year':
        return date.getFullYear().toString();
      case 'list':
        return 'All Events';
      default:
        return '';
    }
  });

  views: CalendarViewMode[] = ['day', 'week', 'month', 'year', 'list'];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  calendarBody = viewChild<ElementRef<HTMLDivElement>>('calendarBody');
  monthCellGrid = viewChild<ElementRef<HTMLDivElement>>('monthCellGrid');

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
      const newDate = new Date(d);
      switch (this.view()) {
        case 'day':
          newDate.setDate(d.getDate() - 1);
          break;
        case 'week':
          newDate.setDate(d.getDate() - 7);
          break;
        case 'month':
          newDate.setMonth(d.getMonth() - 1);
          break;
        case 'year':
          newDate.setFullYear(d.getFullYear() - 1);
          break;
      }
      return newDate;
    });
  }

  nextPeriod(): void {
    this.currentDate.update(d => {
      const newDate = new Date(d);
      switch (this.view()) {
        case 'day':
          newDate.setDate(d.getDate() + 1);
          break;
        case 'week':
          newDate.setDate(d.getDate() + 7);
          break;
        case 'month':
          newDate.setMonth(d.getMonth() + 1);
          break;
        case 'year':
          newDate.setFullYear(d.getFullYear() + 1);
          break;
      }
      return newDate;
    });
  }

  selectMonthInYearView(monthIndex: number): void {
    this.currentDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(monthIndex);
      return newDate;
    });
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
    return this.isSameDay(date, new Date());
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

  private eventCoversDay(event: CalendarEvent, date: Date): boolean {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const s = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate()).getTime();
    const e = new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate()).getTime();
    return s <= d && d <= e;
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

  private computeNewDates(mouseX: number, mouseY: number): { newStart: Date; newEnd: Date } {
    const newStart = new Date(this.dragInitialStart);
    const newEnd = new Date(this.dragInitialEnd);

    if (this.dragType === 'move') {
      const deltaX = mouseX - this.dragInitialX;
      const deltaY = mouseY - this.dragInitialY;
      const dayDelta = this.getDayDelta(deltaX, deltaY);
      newStart.setDate(newStart.getDate() + dayDelta);
      newEnd.setDate(newEnd.getDate() + dayDelta);
    } else if (this.dragType === 'resizeEnd') {
      const target = this.getDateAtPosition(mouseX, mouseY);
      if (target) {
        newEnd.setFullYear(target.getFullYear(), target.getMonth(), target.getDate());
        if (newEnd < newStart) newEnd.setTime(newStart.getTime());
      }
    } else if (this.dragType === 'resizeStart') {
      const target = this.getDateAtPosition(mouseX, mouseY);
      if (target) {
        newStart.setFullYear(target.getFullYear(), target.getMonth(), target.getDate());
        if (newStart > newEnd) newStart.setTime(newEnd.getTime());
      }
    }

    return { newStart, newEnd };
  }

  private getDateAtPosition(mouseX: number, mouseY: number): Date | null {
    const container = this.calendarBody();
    if (!container) return null;

    const rect = container.nativeElement.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const colIndex = Math.max(0, Math.min(6, Math.floor(relativeX / (rect.width / 7))));

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

  private getDayDelta(deltaX: number, deltaY: number = 0): number {
    const container = this.calendarBody();
    if (!container) return 0;
    const containerWidth = container.nativeElement.clientWidth;
    const pixelsPerDay = containerWidth / 7;
    const columnDelta = Math.round(deltaX / pixelsPerDay);

    let rowDelta = 0;
    if (this.dragType === 'move' && this.view() === 'month') {
      const grid = this.monthCellGrid();
      if (grid) {
        const numWeeks = this.monthGrid().length;
        if (numWeeks > 0) {
          const pixelsPerRow = grid.nativeElement.clientHeight / numWeeks;
          rowDelta = Math.round(deltaY / pixelsPerRow);
        }
      }
    }

    return columnDelta + rowDelta * 7;
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
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const grid: CalendarDay[][] = [];
    let week: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      week.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isSameDay(currentDate, new Date()),
        events: [],
      });
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return grid;
  }

  private getWeekDays(date: Date): CalendarDay[] {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push({
        date: day,
        isCurrentMonth: true,
        isToday: this.isSameDay(day, new Date()),
        events: [],
      });
    }
    return week;
  }

  private getYearMonths(year: number): Date[][] {
    const yearGrid: Date[][] = [];
    for (let i = 0; i < 12; i++) {
      const monthGrid: Date[] = [];
      const firstDayOfMonth = new Date(year, i, 1);
      const lastDayOfMonth = new Date(year, i + 1, 0);
      const currentDate = new Date(firstDayOfMonth);
      while (currentDate <= lastDayOfMonth) {
        monthGrid.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      yearGrid.push(monthGrid);
    }
    return yearGrid;
  }
}
