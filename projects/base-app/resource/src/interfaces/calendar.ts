export type CalendarViewMode = 'day' | 'week' | 'month' | 'year' | 'list';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  color: 'blue' | 'indigo' | 'green' | 'purple' | 'pink';
}
