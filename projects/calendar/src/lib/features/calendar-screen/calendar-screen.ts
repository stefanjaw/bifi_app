import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CalendarDay, CalendarEvent, CalendarView } from '../../interfaces/calendar';
import { Calendar } from '../../services/calendar';

@Component({
  selector: 'bifi-app-calendar-screen',
  imports: [CommonModule],
  templateUrl: './calendar-screen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarScreen {
  view = signal<CalendarView>('month');
  currentDate = signal(new Date());
  events = signal<CalendarEvent[]>([]);

  // View models
  monthGrid = signal<CalendarDay[][]>([]);
  weekDays = signal<CalendarDay[]>([]);
  yearMonths = signal<Date[][]>([]);

  sortedEvents = computed(() =>
    this.events()
      .slice()
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  );

  private calendarService = inject(Calendar);

  private eventColorMap = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-500',
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900',
      text: 'text-indigo-800 dark:text-indigo-200',
      border: 'border-indigo-500',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-500',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-800 dark:text-purple-200',
      border: 'border-purple-500',
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900',
      text: 'text-pink-800 dark:text-pink-200',
      border: 'border-pink-500',
    },
  };

  constructor() {
    this.events.set(this.calendarService.getMockEvents());
    this.updateCalendarData();

    effect(() => {
      this.updateCalendarData();
    });
  }

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

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  changeView(newView: CalendarView): void {
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

  getEventColor(color: CalendarEvent['color']) {
    return this.eventColorMap[color];
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

  private updateCalendarData(): void {
    const date = this.currentDate();
    const events = this.events();

    // Month
    const monthGridData = this.calendarService.getMonthGrid(date);
    monthGridData.forEach(week =>
      week.forEach(day => {
        day.events = events.filter(e => this.isSameDay(e.start, day.date));
      })
    );
    this.monthGrid.set(monthGridData);

    // Week
    const weekDaysData = this.calendarService.getWeekDays(date);
    weekDaysData.forEach(day => {
      day.events = events.filter(e => this.isSameDay(e.start, day.date));
    });
    this.weekDays.set(weekDaysData);

    // Year
    this.yearMonths.set(this.calendarService.getYearMonths(date.getFullYear()));
  }

  getMonthName(monthIndex: number): string {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      new Date(2000, monthIndex, 1)
    );
  }

  getFirstDayOfMonth(monthIndex: number): number {
    return new Date(this.currentDate().getFullYear(), monthIndex, 1).getDay();
  }
}
