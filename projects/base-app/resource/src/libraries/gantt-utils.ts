export interface GanttTreeConfig {
  idField: string;
  parentField: string;
}

export type GanttNode<T> = T & {
  level: number;
  children: GanttNode<T>[];
  isExpanded: boolean;
};

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
