import { GanttItem } from '../interfaces/gantt';

export interface GanttTreeConfig {
  idField: string;
  parentField: string;
  sequenceField?: string;
}

export type GanttNode<T> = T & {
  level: number;
  children: GanttNode<T>[];
  isExpanded: boolean;
};

/**
 * Patch descriptor returned by resolveGanttReorder.
 * `parentId` is only present when the dragged item moves to a different sibling group.
 * When `parentId` is a string, it is the new parent's ID.
 * When `parentId` is null, the item should move to the root level.
 */
export interface GanttReorderPatch {
  id: string;
  sequence: number;
  parentId?: string | null;
}

/**
 * Pure helper that computes the sequence patch descriptors needed to
 * persist a before/after Gantt row reorder.
 *
 * Given the current node map and a drag-and-drop event it returns an
 * array of `{ id, sequence, parentId? }` descriptors — one per sibling
 * in the affected group — that consumers can map directly to their own
 * CRUD `put` calls.  Returns `null` when the event is invalid (unknown
 * id / targetId, or the target was removed during the splice).
 *
 * `parentId` is only included in the descriptor for the dragged item
 * when it crosses sibling groups (i.e. its parent changes).
 *
 * @example
 * const patches = resolveGanttReorder(this.ganttMap(), event);
 * if (!patches) return;
 * forkJoin(patches.map(({ id, sequence, parentId }) => {
 *   const data: Record<string, unknown> = { sequence };
 *   if (parentId != null) data['parentId'] = parentId;
 *   return this.crudItems.put({ _id: id, data });
 * })).pipe(takeUntilDestroyed(this.destroy$))
 *   .subscribe({ next: () => this.rm.allData.reload() });
 */
export function resolveGanttReorder<T extends GanttItem>(
  ganttMap: Map<string, GanttNode<T>>,
  event: { id: string; targetId: string; mode: 'before' | 'after' }
): GanttReorderPatch[] | null {
  const target = ganttMap.get(event.targetId);
  if (!target) return null;

  const dragged = ganttMap.get(event.id);
  if (!dragged) return null;

  const targetParentId = target.parentId ?? null;

  const siblings = Array.from(ganttMap.values()).filter(
    n => (n.parentId ?? null) === targetParentId
  );
  siblings.sort((a, b) => (a.sequence ?? 1) - (b.sequence ?? 1));

  const draggedIdx = siblings.findIndex(n => n.id === event.id);
  if (draggedIdx >= 0) siblings.splice(draggedIdx, 1);

  const targetIdx = siblings.findIndex(n => n.id === event.targetId);
  if (targetIdx < 0) return null;

  const insertAt = event.mode === 'before' ? targetIdx : targetIdx + 1;
  siblings.splice(insertAt, 0, dragged);

  const draggedOldParentId = dragged.parentId ?? null;
  const parentChanged = draggedOldParentId !== targetParentId;

  return siblings.map((item, i) => {
    const patch: GanttReorderPatch = { id: item.id, sequence: i + 1 };
    if (item.id === event.id && parentChanged) {
      patch.parentId = targetParentId;
    }
    return patch;
  });
}

/**
 * Builds a parent→child tree from a flat array of any type T.
 * Config specifies which fields act as the node ID and parent ID.
 * Pass `prevMap` to carry over `isExpanded` state across data reloads.
 *
 * @example
 * const { tree, map } = buildGanttTree(items, { idField: 'id', parentField: 'parentId' }, prevMap);
 * const flat = flattenVisible(tree);
 */
export function buildGanttTree<T extends Record<string, any>>(
  items: T[],
  config: GanttTreeConfig,
  prevMap?: Map<string, GanttNode<T>>
): { tree: GanttNode<T>[]; map: Map<string, GanttNode<T>> } {
  const { idField, parentField } = config;

  const nodes = items.map<GanttNode<T>>(item => ({
    ...item,
    level: 0,
    children: [],
    isExpanded: prevMap?.get(item[idField] as string)?.isExpanded ?? false,
  }));

  const map = new Map<string, GanttNode<T>>(nodes.map(n => [n[idField] as string, n]));
  const roots: GanttNode<T>[] = [];

  for (const n of nodes) {
    const parentId = n[parentField] as string | null | undefined;
    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(n);
    } else {
      roots.push(n);
    }
  }

  if (config.sequenceField) {
    const seq = config.sequenceField;
    const sortBySeq = (a: GanttNode<T>, b: GanttNode<T>) =>
      ((a[seq] as number) ?? 1) - ((b[seq] as number) ?? 1);
    roots.sort(sortBySeq);
    for (const node of map.values()) {
      if (node.children.length > 1) node.children.sort(sortBySeq);
    }
  }

  assignLevels(roots);

  return { tree: roots, map };
}

function assignLevels<T>(nodes: GanttNode<T>[], level = 0): void {
  for (const n of nodes) {
    n.level = level;
    if (n.children.length) assignLevels(n.children, level + 1);
  }
}

/** Sets isExpanded = true on every node that has children (recursively). */
export function expandAllNodes<T>(nodes: GanttNode<T>[]): void {
  for (const n of nodes) {
    if (n.children.length > 0) {
      n.isExpanded = true;
      expandAllNodes(n.children);
    }
  }
}

/** Sets isExpanded = false on every node that has children (recursively). */
export function collapseAllNodes<T>(nodes: GanttNode<T>[]): void {
  for (const n of nodes) {
    if (n.children.length > 0) {
      n.isExpanded = false;
      collapseAllNodes(n.children);
    }
  }
}

/**
 * Walks the tree depth-first and returns only the nodes that are visible
 * (i.e. whose ancestors are all expanded). Collapsed children are skipped.
 */
export function flattenVisible<T>(tree: GanttNode<T>[]): GanttNode<T>[] {
  const result: GanttNode<T>[] = [];

  const walk = (nodes: GanttNode<T>[]) => {
    for (const n of nodes) {
      result.push(n);
      if (n.isExpanded && n.children.length > 0) walk(n.children);
    }
  };

  walk(tree);
  return result;
}
