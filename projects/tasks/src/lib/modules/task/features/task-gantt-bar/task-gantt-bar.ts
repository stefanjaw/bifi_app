import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { ganttTask } from '../../interfaces/task-gantt';
import dayjs from 'dayjs';

@Component({
  selector: 'bifi-app-task-gantt-bar',
  imports: [],
  templateUrl: './task-gantt-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskGanttCard {
  // inputs
  task = input.required<ganttTask>();
  index = input.required<number>();
  height = input.required<number>();
  taskOffSet = input.required<number>();
  taskOffWidth = input.required<number>();
  pixelsPerDay = input.required<number>();

  // outputs
  taskClicked = output<ganttTask>();
  dateChange = output<{ start: dayjs.Dayjs; end: dayjs.Dayjs }>();

  // drag internal state
  taskOffset = signal<number>(0);
  taskWidth = signal<number>(0);

  // drag initials
  private initialX = 0;
  private initialOffset = 0;
  private initialWidth = 0;
  private draggingType = signal<'move' | 'resizeEnd' | null>(null);
  private initialStart = signal<dayjs.Dayjs>(dayjs());
  private initialEnd = signal<dayjs.Dayjs>(dayjs());

  constructor() {
    effect(() => {
      const t = this.task();
      if (!t) return;

      this.taskOffset.set(this.taskOffSet());
      this.taskWidth.set(this.taskOffWidth());
      this.initialStart.set(dayjs(t.start));
      this.initialEnd.set(dayjs(t.end));
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

    this.initialStart.set(dayjs(this.task().start));
    this.initialEnd.set(dayjs(this.task().end));
    this.initialOffset = this.taskOffset();
    this.initialWidth = this.taskWidth();

    const moveHandler = (e: MouseEvent) => this.onMouseMove(e);
    const upHandler = () => this.stopDrag(moveHandler, upHandler);

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.draggingType()) return;

    const deltaX = event.clientX - this.initialX;
    const unitsDelta = Math.round(deltaX / this.pixelsPerDay());

    if (this.draggingType() === 'move') {
      this.taskOffset.set(this.initialOffset + unitsDelta * this.pixelsPerDay());
    } else if (this.draggingType() === 'resizeEnd') {
      this.taskWidth.set(this.initialWidth + unitsDelta * this.pixelsPerDay());
    }
  }

  private stopDrag(moveHandler: any, upHandler: any) {
    const deltaX = (event as MouseEvent).clientX - this.initialX;
    const unitsDelta = Math.round(deltaX / this.pixelsPerDay());

    let newStart = this.initialStart();
    let newEnd = this.initialEnd();

    if (this.draggingType() === 'move') {
      newStart = newStart.add(unitsDelta, 'day');
      newEnd = newEnd.add(unitsDelta, 'day');
    } else if (this.draggingType() === 'resizeEnd') {
      newEnd = newEnd.add(unitsDelta, 'day');
      if (newEnd.isBefore(newStart)) newEnd = newStart;
    }

    this.dateChange.emit({ start: newStart, end: newEnd });

    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseup', upHandler);
    this.draggingType.set(null);
  }
}
