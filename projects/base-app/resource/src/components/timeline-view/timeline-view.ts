import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TimelineItem } from './timeline-item';

const AXIS_LEFT = 45;
const AXIS_RIGHT = 955;
const AXIS_RANGE = AXIS_RIGHT - AXIS_LEFT;
const AXIS_Y = 105;

const MIN_LABEL_GAP = 130;
const MAX_LABEL_CHARS = 20;
const LEVEL_HEIGHT = 30;

const COLOR_MAP: Record<NonNullable<TimelineItem['type']>, string> = {
  milestone: '#1e40af',
  checkpoint: '#d97706',
  start: '#dc2626',
  end: '#16a34a',
};

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function getPoints(type: NonNullable<TimelineItem['type']>, cx: number, cy: number): string {
  switch (type) {
    case 'start':
      return `${cx - 12},${cy - 10} ${cx + 12},${cy - 10} ${cx},${cy + 12}`;
    case 'end':
      return `${cx - 10},${cy - 12} ${cx + 10},${cy} ${cx - 10},${cy + 12}`;
    case 'checkpoint':
      return [
        `${cx},${cy - 15}`,
        `${cx + 5},${cy - 5}`,
        `${cx + 15},${cy}`,
        `${cx + 5},${cy + 5}`,
        `${cx},${cy + 15}`,
        `${cx - 5},${cy + 5}`,
        `${cx - 15},${cy}`,
        `${cx - 5},${cy - 5}`,
      ].join(' ');
    default:
      return `${cx},${cy - 14} ${cx + 12},${cy} ${cx},${cy + 14} ${cx - 12},${cy}`;
  }
}

interface PositionedItem {
  label: string;
  fullLabel: string;
  dateLabel: string;
  type: NonNullable<TimelineItem['type']>;
  x: number;
  above: boolean;
  level: number;
  color: string;
  points: string;
  action?: () => void;
}

interface MonthTick {
  label: string;
  x: number;
}

interface TimelineLayout {
  items: PositionedItem[];
  months: MonthTick[];
}

@Component({
  selector: 'bifi-app-timeline-view',
  imports: [],
  templateUrl: './timeline-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineView {
  items = input<TimelineItem[]>([]);

  // 🔥 expuesto al template
  readonly LEVEL_HEIGHT = LEVEL_HEIGHT;

  layout = computed<TimelineLayout>(() => {
    const sorted = [...this.items()].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sorted.length === 0) return { items: [], months: [] };

    const timestamps = sorted.map(i => new Date(i.date).getTime());
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);

    const range = maxTs - minTs || 60 * 24 * 3600 * 1000;
    const pad = range * 0.12;
    const startTs = minTs - pad;
    const endTs = maxTs + pad;
    const totalRange = endTs - startTs;

    const toX = (ts: number): number => AXIS_LEFT + ((ts - startTs) / totalRange) * AXIS_RANGE;

    const aboveLevels: number[] = [];
    const belowLevels: number[] = [];

    function assignLevel(x: number, levels: number[]): number {
      for (let i = 0; i < levels.length; i++) {
        if (x - levels[i] >= MIN_LABEL_GAP) {
          levels[i] = x;
          return i;
        }
      }
      levels.push(x);
      return levels.length - 1;
    }

    const items: PositionedItem[] = sorted.map(item => {
      const type = item.type ?? 'milestone';
      const x = toX(new Date(item.date).getTime());

      let above: boolean;

      const lastAbove = aboveLevels.length ? aboveLevels[aboveLevels.length - 1] : -Infinity;

      const lastBelow = belowLevels.length ? belowLevels[belowLevels.length - 1] : -Infinity;

      const canAbove = x - lastAbove >= MIN_LABEL_GAP;
      const canBelow = x - lastBelow >= MIN_LABEL_GAP;

      if (canAbove && canBelow) {
        // balancea lados
        above = lastAbove <= lastBelow;
      } else if (canAbove) {
        above = true;
      } else if (canBelow) {
        above = false;
      } else {
        // fallback: el lado más cercano
        above = x - lastAbove >= x - lastBelow;
      }

      const level = above ? assignLevel(x, aboveLevels) : assignLevel(x, belowLevels);

      return {
        label: truncate(item.label, MAX_LABEL_CHARS),
        fullLabel: item.label,
        dateLabel: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        type,
        x,
        above,
        level,
        color: COLOR_MAP[type],
        points: getPoints(type, x, AXIS_Y),
        action: item.action,
      };
    });

    const months: MonthTick[] = [];
    const startDate = new Date(startTs);
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (cur.getTime() <= endTs) {
      const x = toX(cur.getTime());
      if (x >= AXIS_LEFT && x <= AXIS_RIGHT) {
        months.push({
          label: cur.toLocaleDateString('en-US', { month: 'short' }),
          x,
        });
      }
      cur.setMonth(cur.getMonth() + 1);
    }

    return { items, months };
  });
}
