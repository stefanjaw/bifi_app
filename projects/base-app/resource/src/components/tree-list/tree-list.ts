import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { GanttNode } from '../../libraries/gantt-utils';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

type AnyNode = GanttNode<any>;

@Component({
  selector: 'bifi-app-tree-list',
  imports: [ButtonModule, CommonModule, TooltipModule],
  templateUrl: './tree-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeList {
  items = input<AnyNode[]>([]);
  enableDragDrop = input<boolean>(false);
  rowHeight = input<number | null>(null);
  rowClass = input<string>(
    'group relative flex items-center justify-between border-b border-r border-gray-200 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 transition-colors'
  );
  nameColClass = input<string>('flex-grow flex justify-start items-center truncate');
  levelIndentBase = input<number>(0);
  showExpandPlaceholder = input<boolean>(false);
  wrapName = input<boolean>(false);

  expandToggle = output<string>();
  itemClick = output<string>();
  itemReorder = output<{ id: string; targetId: string; mode: 'before' | 'after' }>();
  itemReparent = output<{ id: string; parentId: string }>();

  @ContentChild('rowActions') rowActionsTemplate?: TemplateRef<{ $implicit: AnyNode }>;

  rowDragItemId = signal<string | null>(null);
  rowDropTargetId = signal<string | null>(null);
  rowDropMode = signal<'before' | 'after' | 'into' | null>(null);

  onRowDragStart(event: DragEvent, id: string): void {
    event.stopPropagation();
    this.rowDragItemId.set(id);
    event.dataTransfer?.setData('text/plain', id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onRowDragOver(event: DragEvent, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (id === this.rowDragItemId()) return;
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const h = rect.height;
    let mode: 'before' | 'after' | 'into';
    if (y < h / 3) mode = 'before';
    else if (y > (h * 2) / 3) mode = 'after';
    else mode = 'into';
    this.rowDropTargetId.set(id);
    this.rowDropMode.set(mode);
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  onRowDragLeave(event: DragEvent, id: string): void {
    const related = event.relatedTarget as HTMLElement | null;
    const el = event.currentTarget as HTMLElement;
    if (!related || !el.contains(related)) {
      if (this.rowDropTargetId() === id) {
        this.rowDropTargetId.set(null);
        this.rowDropMode.set(null);
      }
    }
  }

  onRowDrop(event: DragEvent, targetId: string): void {
    event.preventDefault();
    event.stopPropagation();
    const dragId = this.rowDragItemId();
    const mode = this.rowDropMode();
    if (!dragId || !mode || dragId === targetId) {
      this.clearRowDrag();
      return;
    }
    if (mode === 'into') {
      this.itemReparent.emit({ id: dragId, parentId: targetId });
    } else {
      this.itemReorder.emit({ id: dragId, targetId, mode });
    }
    this.clearRowDrag();
  }

  onRowDragEnd(): void {
    this.clearRowDrag();
  }

  private clearRowDrag(): void {
    this.rowDragItemId.set(null);
    this.rowDropTargetId.set(null);
    this.rowDropMode.set(null);
  }
}
