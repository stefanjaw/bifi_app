import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
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
export class CalendarView {
  events = input<CalendarEvent[]>([]);

  view = signal<CalendarViewMode>('month');
  currentDate = signal(new Date());

  monthGrid = signal<CalendarDay[][]>([]);
  weekDays = signal<CalendarDay[]>([]);
  yearMonths = signal<Date[][]>([]);

  sortedEvents = computed(() =>
    this.events()
      .slice()
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  );

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

  constructor() {
    this.updateCalendarData();

    effect(() => {
      this.currentDate();
      this.events();
      this.updateCalendarData();
    });
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
      .filter(event => this.isSameDay(event.start, date))
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

  private updateCalendarData(): void {
    const date = this.currentDate();
    const events = this.events();

    const monthGridData = this.getMonthGrid(date);
    monthGridData.forEach(week =>
      week.forEach(day => {
        day.events = events.filter(e => this.isSameDay(e.start, day.date));
      })
    );
    this.monthGrid.set(monthGridData);

    const weekDaysData = this.getWeekDays(date);
    weekDaysData.forEach(day => {
      day.events = events.filter(e => this.isSameDay(e.start, day.date));
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
