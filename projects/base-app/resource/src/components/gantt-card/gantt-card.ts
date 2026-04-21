import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { GanttItem } from '../../interfaces/gantt';
import { GanttNode } from '../../libraries/gantt-utils';
import dayjs from 'dayjs';

export type GanttCardUnit = 'hour' | 'day' | 'month';

@Component({
  selector: 'bifi-app-gantt-card',
  imports: [],
  templateUrl: './gantt-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttCard {
  // inputs
  item = input.required<GanttNode<GanttItem>>();
  index = input.required<number>();
  height = input.required<number>();
  itemOffset = input.required<number>();
  itemWidth = input.required<number>();
  pixelsPerUnit = input.required<number>();
  unit = input.required<GanttCardUnit>();

  // outputs
  dateChange = output<{ start: dayjs.Dayjs; end: dayjs.Dayjs }>();

  // drag internal state
  taskOffset = signal<number>(0);
  taskWidth = signal<number>(0);

  // drag initials
  private initialX = 0;
  private initialOffset = 0;
  private initialWidth = 0;
  private currentUnitsDelta = 0;
  private draggingType = signal<'move' | 'resizeEnd' | null>(null);
  private initialStart = signal<dayjs.Dayjs>(dayjs());
  private initialEnd = signal<dayjs.Dayjs>(dayjs());

  constructor() {
    effect(() => {
      const item = this.item();
      if (!item) return;

      this.taskOffset.set(this.itemOffset());
      this.taskWidth.set(this.itemWidth());
      this.initialStart.set(dayjs(item.start));
      this.initialEnd.set(dayjs(item.end));
    });
  }

  onMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.startDrag(event.clientX, 'move');
  }

  onResizeMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.startDrag(event.clientX, 'resizeEnd');
  }

  private startDrag(clientX: number, type: 'move' | 'resizeEnd') {
    this.initialX = clientX;
    this.draggingType.set(type);

    this.initialStart.set(dayjs(this.item().start));
    this.initialEnd.set(dayjs(this.item().end));
    this.initialOffset = this.taskOffset();
    this.initialWidth = this.taskWidth();
    this.currentUnitsDelta = 0;

    const moveHandler = (e: MouseEvent) => this.onMouseMove(e);
    const upHandler = () => this.stopDrag(moveHandler, upHandler);

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.draggingType()) return;

    const deltaX = event.clientX - this.initialX;
    const unitsDelta = Math.round(deltaX / this.pixelsPerUnit());
    this.currentUnitsDelta = unitsDelta;

    if (this.draggingType() === 'move') {
      this.taskOffset.set(this.initialOffset + unitsDelta * this.pixelsPerUnit());
    } else if (this.draggingType() === 'resizeEnd') {
      this.taskWidth.set(this.initialWidth + unitsDelta * this.pixelsPerUnit());
    }
  }

  private stopDrag(moveHandler: (e: MouseEvent) => void, upHandler: () => void) {
    const unitsDelta = this.currentUnitsDelta;
    const unit = this.unit();

    let newStart = this.initialStart();
    let newEnd = this.initialEnd();

    if (this.draggingType() === 'move') {
      newStart = newStart.add(unitsDelta, unit);
      newEnd = newEnd.add(unitsDelta, unit);
    } else if (this.draggingType() === 'resizeEnd') {
      newEnd = newEnd.add(unitsDelta, unit);
      if (newEnd.isBefore(newStart)) newEnd = newStart;
    }

    this.dateChange.emit({ start: newStart, end: newEnd });

    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseup', upHandler);
    this.draggingType.set(null);
    this.currentUnitsDelta = 0;
  }
}
