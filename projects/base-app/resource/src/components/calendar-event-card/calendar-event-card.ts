import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../interfaces/calendar';
import { LocaleDatePipe } from '@avalantec/base-app/i18n';

const COLOR_MAP = {
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

@Component({
  selector: 'bifi-app-calendar-event-card',
  imports: [CommonModule, LocaleDatePipe],
  templateUrl: './calendar-event-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEventCard {
  event = input.required<CalendarEvent>();
  variant = input<'month' | 'week' | 'day' | 'list'>('month');
  spanPosition = input<'standalone' | 'start' | 'middle' | 'end'>('standalone');

  colors = computed(() => COLOR_MAP[this.event().color] ?? COLOR_MAP['blue']);
}
