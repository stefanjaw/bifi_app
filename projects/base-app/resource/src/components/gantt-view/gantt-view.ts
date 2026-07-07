import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  model,
  NgZone,
  OnDestroy,
  output,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { inject } from '@angular/core';
import { GanttDependency, GanttItem, GanttViewMode } from '../../interfaces/gantt';
import { GanttNode } from '../../libraries/gantt-utils';
import { GanttCard } from '../gantt-card/gantt-card';
import { GanttSwitcher } from '../gantt-switcher/gantt-switcher';
import { TreeList } from '../tree-list/tree-list';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

export interface DayTick {
  pos: number;
  type: 'main' | 'hour' | 'half';
  label: string;
  labelTransform: string;
}

const OVERVIEW_COL_WIDTH = 160;
const OVERVIEW_CARD_WIDTH = 120;
const OVERVIEW_LEFT_PAD = 16;

@Component({
  selector: 'bifi-app-gantt-view',
  imports: [
    ButtonModule,
    CommonModule,
    GanttCard,
    GanttSwitcher,
    TooltipModule,
    TreeList,
    TranslatePipe,
  ],
  templateUrl: './gantt-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttView implements OnDestroy {
  // Inputs — pre-computed by the consumer via buildGanttTree + flattenVisible
  title = input<string>('');
  flat = input<GanttNode<GanttItem>[]>([]);
  map = input<Map<string, GanttNode<GanttItem>>>(new Map());
  dependencies = input<GanttDependency[]>([]);

  // Two-way bindable view mode (owns the switcher internally)
  viewMode = model<GanttViewMode>('Week');

  // Outputs — consumer handles domain logic
  cardDateChange = output<{ id: string; start: dayjs.Dayjs; end: dayjs.Dayjs }>();
  itemClick = output<string>();
  addSubitem = output<string>();
  deleteItem = output<string>();
  expandToggle = output<string>();
  itemReorder = output<{ id: string; targetId: string; mode: 'before' | 'after' }>();
  itemReparent = output<{ id: string; parentId: string }>();

  // Internal signals
  ganttContainer = viewChild<ElementRef<HTMLDivElement>>('ganttContainer');
  resizeObserver?: ResizeObserver;
  rowHeight = signal(40);
  ganttContainerWidth = signal(0);
  panOffsetDays = signal(0);
  isDragging = signal(false);

  private ngZone = inject(NgZone);
  private dragStartX = 0;
  private dragBaseOffset = 0;
  private boundMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundMouseUp: (() => void) | null = null;

  //#region Computed — time-based modes

  timelineRange = computed(() => {
    const mode = this.viewMode();
    const pan = this.panOffsetDays();
    const today = dayjs();

    if (mode === 'Day') {
      const anchor = today.startOf('day').add(pan, 'hour');
      return { start: anchor.toDate(), end: anchor.add(1, 'day').toDate() };
    }

    if (mode === 'Week') {
      const monday = today.startOf('day').subtract((today.day() + 6) % 7, 'day');
      const anchor = monday.add(pan, 'day');
      return { start: anchor.toDate(), end: anchor.add(7, 'day').toDate() };
    }

    if (mode === 'Month') {
      const anchor = today.startOf('month').add(pan, 'day');
      return { start: anchor.toDate(), end: anchor.add(29, 'day').endOf('day').toDate() };
    }

    const anchor = today.startOf('year').add(pan, 'month');
    return { start: anchor.toDate(), end: anchor.add(11, 'month').endOf('month').toDate() };
  });

  totalUnits = computed(() => {
    const mode = this.viewMode();
    if (mode === 'Day') return 24;
    if (mode === 'Week') return 7;
    if (mode === 'Month') return 30;
    return 12;
  });

  pixelsPerUnit = computed(() => this.ganttContainerWidth() / this.totalUnits());

  unit = computed<'hour' | 'day' | 'month'>(() => {
    const mode = this.viewMode();
    if (mode === 'Day') return 'hour';
    if (mode === 'Year') return 'month';
    return 'day';
  });

  timelineWidth = computed(() => this.gridUnits().length * this.pixelsPerUnit());

  gridUnits = computed(() => {
    const mode = this.viewMode();
    const pan = this.panOffsetDays();

    if (mode === 'Day') {
      const anchor = dayjs().startOf('day').add(pan, 'hour');
      return Array.from({ length: 24 }, (_, i) => anchor.add(i, 'hour'));
    }

    if (mode === 'Week') {
      const now = dayjs();
      const monday = now.startOf('day').subtract((now.day() + 6) % 7, 'day');
      const anchor = monday.add(pan, 'day');
      return Array.from({ length: 7 }, (_, i) => anchor.add(i, 'day'));
    }

    if (mode === 'Month') {
      const anchor = dayjs().startOf('month').add(pan, 'day');
      return Array.from({ length: 30 }, (_, i) => anchor.add(i, 'day'));
    }

    const anchor = dayjs().startOf('year').add(pan, 'month');
    return Array.from({ length: 12 }, (_, i) => anchor.add(i, 'month'));
  });

  dayViewTicks = computed((): DayTick[] => {
    if (this.viewMode() !== 'Day') return [];
    const ppu = this.pixelsPerUnit();
    const pan = this.panOffsetDays();
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

  dependencyPaths = computed(() => {
    const visible = this.flat();
    const map = this.map();
    const deps = this.dependencies();
    const rowHeight = this.rowHeight();

    if (!visible.length || !map.size || !deps.length) return [];

    const indexMap = new Map<string, number>();
    visible.forEach((item, i) => indexMap.set(item.id, i));

    const paths: string[] = [];

    for (const dep of deps) {
      const from = map.get(dep.from);
      const to = map.get(dep.to);
      const fromIndex = indexMap.get(dep.from);
      const toIndex = indexMap.get(dep.to);

      if (!from || !to || fromIndex == null || toIndex == null) continue;

      const startX = this.getItemOffset(from) + this.getItemWidth(from);
      const startY = fromIndex * rowHeight + rowHeight / 2;
      const endX = this.getItemOffset(to) - 8;
      const endY = toIndex * rowHeight + rowHeight / 2;
      const r = 15;

      if (endX > startX) {
        paths.push(`M ${startX},${startY} H ${startX + r / 2} V ${endY} H ${endX}`);
      } else {
        const midY = startY < endY ? startY + rowHeight / 2 : startY - rowHeight / 2;
        paths.push(
          `M ${startX},${startY} H ${startX + r} V ${midY} H ${endX - r} V ${endY} H ${endX}`
        );
      }
    }

    return paths;
  });

  todayOffset = computed(() => {
    const ppu = this.pixelsPerUnit();
    const mode = this.viewMode();
    const pan = this.panOffsetDays();

    if (mode === 'Day') {
      const now = dayjs();
      const anchor = dayjs().startOf('day').add(pan, 'hour');
      const diffHours = now.diff(anchor, 'hour', true);
      if (diffHours < 0 || diffHours >= 24) return -1;
      return diffHours * ppu;
    }

    if (mode === 'Week') {
      const today = dayjs().startOf('day');
      const monday = today.subtract((today.day() + 6) % 7, 'day');
      const anchor = monday.add(pan, 'day');
      const daysSinceStart = today.diff(anchor, 'day');
      if (daysSinceStart < 0 || daysSinceStart >= 7) return -1;
      return daysSinceStart * ppu + ppu / 2;
    }

    if (mode === 'Month') {
      const today = dayjs().startOf('day');
      const anchor = dayjs().startOf('month').add(pan, 'day');
      const daysSinceStart = today.diff(anchor, 'day');
      if (daysSinceStart < 0 || daysSinceStart >= 30) return -1;
      return daysSinceStart * ppu + ppu / 2;
    }

    const today = dayjs();
    const anchor = dayjs().startOf('year').add(pan, 'month');
    const monthsSinceStart = today.diff(anchor, 'month');
    if (monthsSinceStart < 0 || monthsSinceStart >= 12) return -1;
    return monthsSinceStart * ppu + ppu / 2;
  });

  //#endregion

  //#region Computed — Overview mode

  overviewLayout = computed((): Map<string, { x: number; width: number }> | null => {
    if (this.viewMode() !== 'Overview') return null;

    const items = this.flat();
    const deps = this.dependencies();

    // Build predecessor map: dep.from must finish before dep.to starts
    const predecessors = new Map<string, string[]>();
    const itemIdSet = new Set(items.map(i => i.id));
    for (const item of items) predecessors.set(item.id, []);
    for (const dep of deps) {
      const list = predecessors.get(dep.to);
      if (list) list.push(dep.from);
    }
    // Also treat parentId as an implicit predecessor so children are always
    // placed at least one column to the right of their parent.
    for (const item of items) {
      if (item.parentId && itemIdSet.has(item.parentId)) {
        predecessors.get(item.id)!.push(item.parentId);
      }
    }

    // Compute column depth via memoised recursion (longest predecessor chain)
    const depthCache = new Map<string, number>();
    const getDepth = (id: string, visiting: Set<string>): number => {
      if (depthCache.has(id)) return depthCache.get(id)!;
      if (visiting.has(id)) return 0; // cycle guard
      const next = new Set(visiting);
      next.add(id);
      const preds = predecessors.get(id) ?? [];
      const depth = preds.length === 0 ? 0 : Math.max(...preds.map(p => getDepth(p, next))) + 1;
      depthCache.set(id, depth);
      return depth;
    };

    for (const item of items) getDepth(item.id, new Set());

    // Build children map from parentId so we can compute subtree widths
    const childrenOf = new Map<string, string[]>();
    for (const item of items) childrenOf.set(item.id, []);
    for (const item of items) {
      if (item.parentId && itemIdSet.has(item.parentId)) {
        childrenOf.get(item.parentId)!.push(item.id);
      }
    }

    // Compute the rightmost pixel edge of each item's entire subtree (memoised)
    const subtreeRight = new Map<string, number>();
    const getSubtreeRight = (id: string): number => {
      if (subtreeRight.has(id)) return subtreeRight.get(id)!;
      const col = depthCache.get(id) ?? 0;
      const selfRight = OVERVIEW_LEFT_PAD + col * OVERVIEW_COL_WIDTH + OVERVIEW_CARD_WIDTH;
      const children = childrenOf.get(id) ?? [];
      const right =
        children.length === 0
          ? selfRight
          : Math.max(selfRight, ...children.map(c => getSubtreeRight(c)));
      subtreeRight.set(id, right);
      return right;
    };
    for (const item of items) getSubtreeRight(item.id);

    // Each item's width stretches from its own x to the right edge of its deepest descendant
    const layout = new Map<string, { x: number; width: number }>();
    for (const item of items) {
      const col = depthCache.get(item.id) ?? 0;
      const x = OVERVIEW_LEFT_PAD + col * OVERVIEW_COL_WIDTH;
      layout.set(item.id, { x, width: subtreeRight.get(item.id)! - x });
    }

    return layout;
  });

  overviewTotalWidth = computed(() => {
    const layout = this.overviewLayout();
    if (!layout) return 0;
    let maxRight = 0;
    for (const { x, width } of layout.values()) {
      maxRight = Math.max(maxRight, x + width);
    }
    return maxRight + 32;
  });

  overviewDependencyPaths = computed((): string[] => {
    const layout = this.overviewLayout();
    if (!layout) return [];

    const visible = this.flat();
    const deps = this.dependencies();
    const rowHeight = this.rowHeight();

    if (!visible.length || !deps.length) return [];

    const indexMap = new Map<string, number>();
    visible.forEach((item, i) => indexMap.set(item.id, i));

    const paths: string[] = [];

    for (const dep of deps) {
      const fromLayout = layout.get(dep.from);
      const toLayout = layout.get(dep.to);
      const fromIndex = indexMap.get(dep.from);
      const toIndex = indexMap.get(dep.to);

      if (!fromLayout || !toLayout || fromIndex == null || toIndex == null) continue;

      const startX = fromLayout.x + fromLayout.width;
      const startY = fromIndex * rowHeight + rowHeight / 2;
      const endX = toLayout.x - 8;
      const endY = toIndex * rowHeight + rowHeight / 2;
      const r = 15;

      if (endX > startX) {
        paths.push(`M ${startX},${startY} H ${startX + r / 2} V ${endY} H ${endX}`);
      } else {
        const midY = startY < endY ? startY + rowHeight / 2 : startY - rowHeight / 2;
        paths.push(
          `M ${startX},${startY} H ${startX + r} V ${midY} H ${endX - r} V ${endY} H ${endX}`
        );
      }
    }

    return paths;
  });

  //#endregion

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

  onGanttMouseDown(event: MouseEvent): void {
    if (this.viewMode() === 'Overview') return;
    if ((event.target as Element).closest('bifi-app-gantt-card')) return;

    event.preventDefault();

    this.dragStartX = event.clientX;
    this.dragBaseOffset = this.panOffsetDays();

    this.ngZone.run(() => this.isDragging.set(true));

    this.ngZone.runOutsideAngular(() => {
      this.boundMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - this.dragStartX;
        const ppu = this.pixelsPerUnit();
        const delta = -deltaX / ppu;
        this.ngZone.run(() => this.panOffsetDays.set(this.dragBaseOffset + delta));
      };

      this.boundMouseUp = () => {
        this.ngZone.run(() => {
          this.isDragging.set(false);
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

  getItemOffset(item: GanttNode<GanttItem>): number {
    const ppu = this.pixelsPerUnit();
    const mode = this.viewMode();

    if (mode === 'Day') {
      const rangeStart = dayjs(this.timelineRange().start);
      return dayjs(item.start).diff(rangeStart, 'hour') * ppu;
    }

    if (mode === 'Year') {
      const rangeStart = dayjs(this.timelineRange().start);
      return dayjs(item.start).diff(rangeStart, 'month') * ppu;
    }

    const rangeStart = dayjs(this.timelineRange().start);
    return dayjs(item.start).diff(rangeStart, 'day') * ppu;
  }

  getItemWidth(item: GanttNode<GanttItem>): number {
    const ppu = this.pixelsPerUnit();
    const mode = this.viewMode();

    if (mode === 'Day') {
      const start = dayjs(item.start);
      const end = dayjs(item.end);
      return Math.max(end.diff(start, 'hour'), 1) * ppu;
    }

    if (mode === 'Year') {
      const start = dayjs(item.start);
      const end = dayjs(item.end);
      return Math.max(end.diff(start, 'month') + 1, 1) * ppu;
    }

    const start = dayjs(item.start);
    const end = dayjs(item.end);
    return (end.diff(start, 'day') + 1) * ppu;
  }

  getOverviewItemOffset(itemId: string): number {
    return this.overviewLayout()?.get(itemId)?.x ?? 0;
  }

  getOverviewItemWidth(itemId: string): number {
    return this.overviewLayout()?.get(itemId)?.width ?? OVERVIEW_CARD_WIDTH;
  }

  formatDateHeader(date: dayjs.Dayjs): string {
    switch (this.viewMode()) {
      case 'Week':
        return date.format('ddd MMM D');
      case 'Month':
        return String(date.date());
      case 'Year':
        return date.format('MMM');
      default:
        return '';
    }
  }

  showColumnBorder(): boolean {
    const mode = this.viewMode();
    return mode === 'Day' || mode === 'Week';
  }

  scrollToTask(item: GanttNode<GanttItem>): void {
    if (this.viewMode() === 'Overview') return;
    if (!item.start || !item.end) return;

    const start = dayjs(item.start);
    const end = dayjs(item.end);
    const mode = this.viewMode();
    let newPan: number;

    if (mode === 'Day') {
      const midnight = dayjs().startOf('day');
      const midHours = (start.diff(midnight, 'hour', true) + end.diff(midnight, 'hour', true)) / 2;
      newPan = midHours - 12;
    } else if (mode === 'Week') {
      const now = dayjs();
      const monday = now.startOf('day').subtract((now.day() + 6) % 7, 'day');
      const midDays = (start.diff(monday, 'day', true) + end.diff(monday, 'day', true)) / 2;
      newPan = midDays - 3.5;
    } else if (mode === 'Month') {
      const monthStart = dayjs().startOf('month');
      const midDays = (start.diff(monthStart, 'day', true) + end.diff(monthStart, 'day', true)) / 2;
      newPan = midDays - 15;
    } else {
      const yearStart = dayjs().startOf('year');
      const midMonths =
        (start.diff(yearStart, 'month', true) + end.diff(yearStart, 'month', true)) / 2;
      newPan = midMonths - 6;
    }

    this.panOffsetDays.set(Math.round(newPan));
  }

  onCardDateChange(id: string, start: dayjs.Dayjs, end: dayjs.Dayjs): void {
    this.cardDateChange.emit({ id, start, end });
  }

  //#endregion
}
