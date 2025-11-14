import { Injectable } from '@angular/core';
import { CalendarDay, CalendarEvent } from '../interfaces/calendar';

@Injectable({
  providedIn: 'root',
})
export class Calendar {
  public getMonthGrid(date: Date): CalendarDay[][] {
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

  public getWeekDays(date: Date): CalendarDay[] {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push({
        date: day,
        isCurrentMonth: true, // In week view, all days are "current"
        isToday: this.isSameDay(day, new Date()),
        events: [],
      });
    }
    return week;
  }

  public getYearMonths(year: number): Date[][] {
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

  public getMockEvents(): CalendarEvent[] {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return [
      {
        id: 1,
        title: 'Team Standup',
        start: new Date(currentYear, currentMonth, today.getDate(), 9, 0),
        end: new Date(currentYear, currentMonth, today.getDate(), 9, 30),
        color: 'blue',
      },
      {
        id: 2,
        title: 'Design Review',
        start: new Date(currentYear, currentMonth, today.getDate() - 2, 14, 0),
        end: new Date(currentYear, currentMonth, today.getDate() - 2, 15, 30),
        color: 'indigo',
      },
      {
        id: 3,
        title: 'Project Kick-off',
        start: new Date(currentYear, currentMonth, 2, 11, 0),
        end: new Date(currentYear, currentMonth, 2, 12, 0),
        color: 'green',
      },
      {
        id: 4,
        title: 'Frontend Sync',
        start: new Date(currentYear, currentMonth, 15, 10, 0),
        end: new Date(currentYear, currentMonth, 15, 11, 30),
        color: 'purple',
      },
      {
        id: 5,
        title: 'User Testing Session',
        start: new Date(currentYear, currentMonth, 23, 13, 0),
        end: new Date(currentYear, currentMonth, 23, 16, 0),
        color: 'pink',
      },
      {
        id: 6,
        title: 'Deploy to Staging',
        start: new Date(currentYear, currentMonth + 1, 1, 16, 0),
        end: new Date(currentYear, currentMonth + 1, 1, 16, 30),
        color: 'blue',
      },
    ];
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
