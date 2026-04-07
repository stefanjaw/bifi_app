export interface TimelineItem {
  label: string;
  date: Date | string;
  type?: 'milestone' | 'checkpoint' | 'start' | 'end';
  action?: () => void;
}
